-- REJENDARI points engine: pontos por compra, qualificação de referrals e sorteio agendado.
-- Dependências: base (profiles/points_ledger/raffles), referrals (20260927114500), orders (20261001120000).
-- Tudo idempotente: pode ser re-aplicado sem duplicar pontos.

-- ── 1. Ledger: ligação à encomenda + garantia de creditação única ──────────
ALTER TABLE public.points_ledger
  ADD COLUMN IF NOT EXISTS order_id UUID REFERENCES public.orders (id) ON DELETE SET NULL;

-- Uma encomenda credencia pontos uma única vez, mesmo que o estado 'paid'
-- seja escrito duas vezes (retries do webhook, correção manual).
CREATE UNIQUE INDEX IF NOT EXISTS points_ledger_purchase_once
  ON public.points_ledger (order_id)
  WHERE reason = 'purchase' AND order_id IS NOT NULL;

-- ── 2. Campanha de referrals: montantes configuráveis, uma ativa de cada vez ─
CREATE TABLE IF NOT EXISTS public.referral_campaign (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  referrer_points INTEGER NOT NULL CHECK (referrer_points >= 0),
  referred_points INTEGER NOT NULL CHECK (referred_points >= 0),
  active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Só pode existir uma campanha ativa: o índice único parcial garante-no.
CREATE UNIQUE INDEX IF NOT EXISTS referral_campaign_single_active
  ON public.referral_campaign (active)
  WHERE active;

-- Config interna: sem políticas de RLS, leitura/escrita apenas via service_role
-- (e via security definer dentro do trigger).
ALTER TABLE public.referral_campaign ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.referral_campaign FROM anon, authenticated;

-- ── 3. Trigger de encomenda paga ────────────────────────────────────────────
-- Cobra pontos (1 pt por 1 €, EUR, utilizador conhecido), qualifica o referral
-- na primeira compra do convidado e paga os montantes da campanha ativa.
-- Corre para qualquer gateway: o estado 'paid' é a única entrada.
CREATE OR REPLACE FUNCTION public.handle_order_paid()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_points INTEGER;
  v_campaign public.referral_campaign%ROWTYPE;
  v_referral UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.status <> 'paid' THEN
      RETURN NEW;
    END IF;
  ELSE
    IF NEW.status <> 'paid' OR OLD.status = 'paid' THEN
      RETURN NEW;
    END IF;
  END IF;

  IF NEW.user_id IS NULL OR NEW.total_currency <> 'EUR' THEN
    RETURN NEW;
  END IF;

  v_points := floor(NEW.total_amount)::INTEGER;
  IF v_points <= 0 THEN
    RETURN NEW;
  END IF;

  BEGIN
    INSERT INTO public.points_ledger (user_id, delta, reason, order_id)
    VALUES (NEW.user_id, v_points, 'purchase', NEW.id);
  EXCEPTION WHEN unique_violation THEN
    RETURN NEW; -- encomenda já creditada
  END;

  UPDATE public.profiles
     SET points = points + v_points
   WHERE id = NEW.user_id;

  -- Primeira compra do convidado qualifica o referral (facto, independente
  -- de haver campanha; o pagamento depende da campanha ativa).
  UPDATE public.referrals
     SET status = 'qualified', qualified_at = now()
   WHERE referred_user_id = NEW.user_id
     AND status = 'signed_up';

  SELECT * INTO v_campaign
    FROM public.referral_campaign
   WHERE active
   LIMIT 1;

  IF FOUND THEN
    SELECT id INTO v_referral
      FROM public.referrals
     WHERE referred_user_id = NEW.user_id
       AND status = 'qualified'
     LIMIT 1;

    IF v_referral IS NOT NULL THEN
      PERFORM public.award_referral_points(v_referral, v_campaign.referrer_points, v_campaign.referred_points);
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_order_paid() FROM PUBLIC, anon, authenticated;

DROP TRIGGER IF EXISTS orders_paid_award_points ON public.orders;
CREATE TRIGGER orders_paid_award_points
  AFTER INSERT OR UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_order_paid();

-- ── 4. Sorteio semanal agendado ─────────────────────────────────────────────
-- draw_weekly_raffle() fecha/sorteia as raffles cuja semana terminou.
CREATE EXTENSION IF NOT EXISTS pg_cron;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM cron.job WHERE jobname = 'rejendari-weekly-raffle') THEN
    PERFORM cron.unschedule('rejendari-weekly-raffle');
  END IF;
  PERFORM cron.schedule(
    'rejendari-weekly-raffle',
    '0 22 * * 0',
    $$SELECT public.draw_weekly_raffle();$$
  );
END;
$$;
