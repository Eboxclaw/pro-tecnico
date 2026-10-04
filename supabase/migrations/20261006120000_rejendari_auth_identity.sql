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
