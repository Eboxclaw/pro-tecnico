-- Procura 100% real: likes exigem conta, reservas ganham preço justo e motivo.
-- Fim dos números inflados: os contadores do site mostram apenas interações de
-- utilizadores registados.

-- ---------------------------------------------------------------------------
-- Likes: ligados a conta (o visitor_id anónimo deixa de se usar)
-- ---------------------------------------------------------------------------

ALTER TABLE public.system_likes
  ALTER COLUMN visitor_id DROP NOT NULL;
ALTER TABLE public.system_likes
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users (id) ON DELETE CASCADE;

-- um like por system por utilizador
CREATE UNIQUE INDEX IF NOT EXISTS system_likes_user_unique
  ON public.system_likes (system_id, user_id)
  WHERE user_id IS NOT NULL;

DROP FUNCTION IF EXISTS public.like_system(TEXT, UUID);

CREATE OR REPLACE FUNCTION public.like_system(p_system_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_uid UUID;
  v_recent INTEGER;
BEGIN
  v_uid := auth.uid();
  IF v_uid IS NULL THEN
    RETURN FALSE; -- like exige conta
  END IF;

  IF p_system_id IS NULL OR p_system_id !~ '^[a-z0-9-]{1,64}$' THEN
    RETURN FALSE;
  END IF;

  SELECT count(*) INTO v_recent
  FROM public.system_likes
  WHERE user_id = v_uid
    AND created_at > now() - INTERVAL '24 hours';

  IF v_recent >= 24 THEN
    RETURN FALSE;
  END IF;

  INSERT INTO public.system_likes (system_id, user_id, visitor_id)
  VALUES (p_system_id, v_uid, NULL)
  ON CONFLICT DO NOTHING;

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.like_system(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.like_system(TEXT) TO authenticated;

-- likes antigos por visitante ficam no histórico mas saem da contagem pública
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
    SELECT system_id FROM public.system_likes WHERE user_id IS NOT NULL
    UNION
    SELECT system_id FROM public.system_favorites
    UNION
    SELECT system_id FROM public.system_reservations WHERE status = 'active'
  ) AS s
  LEFT JOIN (
    SELECT system_id, count(*) AS cnt
    FROM public.system_likes
    WHERE user_id IS NOT NULL
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

-- ---------------------------------------------------------------------------
-- Reservas: preço justo + motivo (para saber a que preço compram e porquê)
-- ---------------------------------------------------------------------------

ALTER TABLE public.system_reservations
  ADD COLUMN IF NOT EXISTS fair_price NUMERIC
    CHECK (fair_price IS NULL OR (fair_price >= 0 AND fair_price <= 1000));
ALTER TABLE public.system_reservations
  ADD COLUMN IF NOT EXISTS reason TEXT
    CHECK (reason IS NULL OR char_length(reason) <= 280);
