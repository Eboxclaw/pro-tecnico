-- ============================================================================
-- REJENDARI · APPLY-ALL — executa as 3 migrations pendentes numa única passagem
-- Como usar: Supabase Dashboard → SQL Editor → New query → colar tudo → Run.
--
-- Depois de correr, confirma no fim deste ficheiro o bloco de VERIFICAÇÃO.
--
-- NOTA (entrar por email): Auth → Emails → Templates: o template "Login" /
-- "Confirm signup" deve incluir {{ .Token }} para o código de 6 dígitos
-- aparecer no email ({{ .ConfirmationURL }} envia link mágico — também entra).
-- ============================================================================

-- ═══ MIGRATION 1/3 · 20261004120000_rejendari_points_engine.sql ═══
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

-- ═══ MIGRATION 2/3 · 20261005120000_rejendari_systems_demand.sql ═══
-- Systems demand engine: likes (anónimos por visitor_id), favoritos e reservas
-- (associados a conta), com contagens públicas agregadas via security-definer RPC.
-- O catálogo de systems vive em código (src/data/systems.ts); aqui vive apenas
-- a procura — é o que transforma o site numa ferramenta de procurement.

-- ---------------------------------------------------------------------------
-- Admin
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

-- ---------------------------------------------------------------------------
-- Likes: baixo compromisso, um por visitante, append-only
-- ---------------------------------------------------------------------------

CREATE TABLE public.system_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id TEXT NOT NULL,
  visitor_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (system_id, visitor_id)
);
GRANT INSERT ON public.system_likes TO anon, authenticated;
GRANT ALL ON public.system_likes TO service_role;
ALTER TABLE public.system_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_likes_insert_any" ON public.system_likes
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "system_likes_admin_read" ON public.system_likes
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE INDEX system_likes_system_idx ON public.system_likes (system_id);

-- ---------------------------------------------------------------------------
-- Favoritos: requer conta, toggling próprio
-- ---------------------------------------------------------------------------

CREATE TABLE public.system_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (system_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.system_favorites TO authenticated;
GRANT ALL ON public.system_favorites TO service_role;
ALTER TABLE public.system_favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_favorites_select_own" ON public.system_favorites
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "system_favorites_insert_own" ON public.system_favorites
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "system_favorites_delete_own" ON public.system_favorites
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "system_favorites_admin_read" ON public.system_favorites
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE INDEX system_favorites_user_idx ON public.system_favorites (user_id);
CREATE INDEX system_favorites_system_idx ON public.system_favorites (system_id);

-- ---------------------------------------------------------------------------
-- Reservas: intenção real de compra, uma por system por utilizador
-- ---------------------------------------------------------------------------

CREATE TABLE public.system_reservations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  system_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users (id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity >= 1 AND quantity <= 50),
  profession TEXT CHECK (
    profession IS NULL OR profession IN (
      'AVAC', 'Eletricidade', 'Canalização', 'Mecânica', 'Solar',
      'Eletrónica', 'Automóvel', 'Carpintaria', 'DIY / Outro'
    )
  ),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (system_id, user_id)
);
GRANT SELECT, INSERT, UPDATE ON public.system_reservations TO authenticated;
GRANT ALL ON public.system_reservations TO service_role;
ALTER TABLE public.system_reservations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "system_reservations_select_own" ON public.system_reservations
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "system_reservations_insert_own" ON public.system_reservations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "system_reservations_update_own" ON public.system_reservations
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "system_reservations_admin_read" ON public.system_reservations
  FOR SELECT TO authenticated USING (public.is_admin());
CREATE INDEX system_reservations_user_idx ON public.system_reservations (user_id);
CREATE INDEX system_reservations_system_idx ON public.system_reservations (system_id);

CREATE TRIGGER system_reservations_touch_updated_at
  BEFORE UPDATE ON public.system_reservations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Contagens públicas: única porta de entrada para os contadores do site
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.system_demand_counts()
RETURNS TABLE (
  system_id TEXT,
  like_count BIGINT,
  favorite_count BIGINT,
  reservation_count BIGINT,
  unit_count BIGINT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    s.system_id,
    COALESCE(l.cnt, 0) AS like_count,
    COALESCE(f.cnt, 0) AS favorite_count,
    COALESCE(r.cnt, 0) AS reservation_count,
    COALESCE(r.units, 0) AS unit_count
  FROM (
    SELECT system_id FROM public.system_likes
    UNION
    SELECT system_id FROM public.system_favorites
    UNION
    SELECT system_id FROM public.system_reservations WHERE status = 'active'
  ) AS s
  LEFT JOIN (
    SELECT system_id, count(*) AS cnt
    FROM public.system_likes
    GROUP BY system_id
  ) AS l USING (system_id)
  LEFT JOIN (
    SELECT system_id, count(*) AS cnt
    FROM public.system_favorites
    GROUP BY system_id
  ) AS f USING (system_id)
  LEFT JOIN (
    SELECT system_id, count(*) AS cnt, COALESCE(sum(quantity), 0) AS units
    FROM public.system_reservations
    WHERE status = 'active'
    GROUP BY system_id
  ) AS r USING (system_id);
$$;

REVOKE ALL ON FUNCTION public.system_demand_counts() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.system_demand_counts() TO anon, authenticated;

-- ═══ MIGRATION 3/3 · 20261006120000_rejendari_auth_identity.sql ═══
-- Entrada passwordless, likes endurecidos e identificação de cliente.
--
-- 1) Likes: INSERT direto sai; passa por RPC com validação e máx. diário
--    por visitante. Risco residual (rotação de visitor_id) documentado no
--    docs/REFINEMENT-ROADMAP.md — mitigação futura: Cloudflare Turnstile.
-- 2) Perfis: dados de faturação (company/vat/phone) saem — ficam para os
--    payment providers; entra a identificação REJENDARI (customer_code,
--    região, código postal) com histórico agregado para o admin.

-- ---------------------------------------------------------------------------
-- 1. Likes: porta de entrada única com limites
-- ---------------------------------------------------------------------------

REVOKE INSERT ON public.system_likes FROM anon, authenticated;

CREATE OR REPLACE FUNCTION public.like_system(
  p_system_id TEXT,
  p_visitor_id UUID
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_recent INTEGER;
BEGIN
  -- formato do system id (catálogo vive em código, ids são slugs)
  IF p_system_id IS NULL OR p_system_id !~ '^[a-z0-9-]{1,64}$' THEN
    RETURN FALSE;
  END IF;

  -- máx. 24 likes por visitante em 24h (gravações repetidas do mesmo par
  -- caem no UNIQUE e não contam para o limite)
  SELECT count(*) INTO v_recent
  FROM public.system_likes
  WHERE visitor_id = p_visitor_id
    AND created_at > now() - INTERVAL '24 hours';

  IF v_recent >= 24 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.system_likes (system_id, visitor_id)
  VALUES (p_system_id, p_visitor_id)
  ON CONFLICT (system_id, visitor_id) DO NOTHING;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.like_system(TEXT, UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.like_system(TEXT, UUID) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.admin_likes_today()
RETURNS TABLE (system_id TEXT, likes_last_24h BIGINT)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT system_id, count(*)::BIGINT AS likes_last_24h
  FROM public.system_likes
  WHERE created_at > now() - INTERVAL '24 hours'
  GROUP BY system_id;
$$;

REVOKE ALL ON FUNCTION public.admin_likes_today() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_likes_today() TO authenticated;

-- ---------------------------------------------------------------------------
-- 2. Perfis: minimalismo + identificação
-- ---------------------------------------------------------------------------

ALTER TABLE public.profiles DROP COLUMN IF EXISTS company;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS vat_number;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS phone;

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS customer_code TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS postal_code TEXT;

-- Código de cliente determinístico e único: REJ-XXXXXX
UPDATE public.profiles
SET customer_code = 'REJ-' || upper(substr(md5('c' || id::text), 1, 6))
WHERE customer_code IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_customer_code_key ON public.profiles (customer_code);

-- Grants de escrita: só o que o cliente pode editar
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, region, postal_code) ON public.profiles TO authenticated;

-- Admin lê todos os perfis (emails, códigos, região) — policy que faltava
CREATE POLICY "profiles_admin_read" ON public.profiles
  FOR SELECT TO authenticated USING (public.is_admin());

-- Novos utilizadores já nascem com código de cliente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referrer UUID;
BEGIN
  INSERT INTO public.profiles (id, email, full_name, points, referral_code, customer_code)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    50,
    upper(substr(md5(NEW.id::text), 1, 10)),
    'REJ-' || upper(substr(md5('c' || NEW.id::text), 1, 6))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.points_ledger (user_id, delta, reason)
  VALUES (NEW.id, 50, 'signup_bonus')
  ON CONFLICT DO NOTHING;

  IF NEW.raw_user_meta_data ->> 'referred_by_code' IS NOT NULL THEN
    SELECT id INTO v_referrer
    FROM public.profiles
    WHERE referral_code = upper(NEW.raw_user_meta_data ->> 'referred_by_code')
      AND id <> NEW.id
    LIMIT 1;

    IF v_referrer IS NOT NULL THEN
      INSERT INTO public.referrals (code, referrer_id, referred_user_id)
      VALUES (upper(NEW.raw_user_meta_data ->> 'referred_by_code'), v_referrer, NEW.id)
      ON CONFLICT DO NOTHING;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. Vista de clientes para o admin (histórico agregado)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.admin_customers()
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  customer_code TEXT,
  region TEXT,
  postal_code TEXT,
  points INTEGER,
  orders_count BIGINT,
  orders_total_eur NUMERIC,
  reservations_count BIGINT,
  last_activity TIMESTAMPTZ
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    p.id AS user_id,
    p.email,
    p.customer_code,
    p.region,
    p.postal_code,
    p.points,
    COALESCE(o.orders_count, 0)::BIGINT,
    COALESCE(o.orders_total_eur, 0)::NUMERIC,
    COALESCE(r.reservations_count, 0)::BIGINT,
    GREATEST(
      p.updated_at,
      COALESCE(o.last_order_at, p.updated_at),
      COALESCE(r.last_reservation_at, p.updated_at)
    ) AS last_activity
  FROM public.profiles p
  LEFT JOIN (
    SELECT user_id,
           count(*) AS orders_count,
           sum(total_amount) FILTER (WHERE total_currency = 'EUR') AS orders_total_eur,
           max(created_at) AS last_order_at
    FROM public.orders
    WHERE status = 'paid'
    GROUP BY user_id
  ) o ON o.user_id = p.id
  LEFT JOIN (
    SELECT user_id,
           count(*) AS reservations_count,
           max(created_at) AS last_reservation_at
    FROM public.system_reservations
    WHERE status = 'active'
    GROUP BY user_id
  ) r ON r.user_id = p.id
  ORDER BY last_activity DESC
  LIMIT 200;
$$;

REVOKE ALL ON FUNCTION public.admin_customers() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_customers() TO authenticated;

-- ============================================================================
-- VERIFICAÇÃO (corre as queries depois do Run; todos devem devolver linhas)
-- ============================================================================
SELECT 'system_likes' AS objeto, 'tabela' AS tipo UNION ALL
SELECT 'system_favorites', 'tabela' UNION ALL
SELECT 'system_reservations', 'tabela' UNION ALL
SELECT 'referral_campaign', 'tabela';

SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN ('like_system', 'system_demand_counts', 'admin_likes_today',
                       'admin_customers', 'is_admin', 'handle_order_paid',
                       'handle_new_user', 'award_referral_points')
ORDER BY routine_name;

SELECT count(*) AS perfis_com_customer_code FROM public.profiles WHERE customer_code IS NOT NULL;

SELECT system_id, like_count, reservation_count, unit_count FROM public.system_demand_counts() LIMIT 5;
-- ============================================================================
