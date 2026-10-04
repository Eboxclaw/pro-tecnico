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
