CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  vat_number TEXT,
  phone TEXT,
  points INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.points_ledger (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  delta INTEGER NOT NULL,
  reason TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.points_ledger TO authenticated;
GRANT ALL ON public.points_ledger TO service_role;
ALTER TABLE public.points_ledger ENABLE ROW LEVEL SECURITY;
CREATE POLICY "points_select_own" ON public.points_ledger FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.raffles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  week_start DATE NOT NULL UNIQUE,
  title TEXT NOT NULL,
  prize TEXT NOT NULL,
  prize_brand TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  drawn_at TIMESTAMPTZ,
  winner_user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  winner_label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.raffles TO anon, authenticated;
GRANT ALL ON public.raffles TO service_role;
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "raffles_public_read" ON public.raffles FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.raffle_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id UUID NOT NULL REFERENCES public.raffles ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (raffle_id, user_id)
);
GRANT SELECT, INSERT ON public.raffle_entries TO authenticated;
GRANT ALL ON public.raffle_entries TO service_role;
ALTER TABLE public.raffle_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "entries_select_own" ON public.raffle_entries FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "entries_insert_own" ON public.raffle_entries FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE TABLE public.b2b_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE SET NULL,
  company TEXT NOT NULL,
  vat_number TEXT,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  trade TEXT,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.b2b_requests TO anon, authenticated;
GRANT ALL ON public.b2b_requests TO service_role;
ALTER TABLE public.b2b_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "b2b_insert_any" ON public.b2b_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE TABLE public.waitlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  locale TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT INSERT ON public.waitlist TO anon, authenticated;
GRANT ALL ON public.waitlist TO service_role;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "waitlist_insert_any" ON public.waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$
LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, points)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name', 50)
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.points_ledger (user_id, delta, reason)
  VALUES (NEW.id, 50, 'signup_bonus');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.draw_weekly_raffle()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  r RECORD;
  w RECORD;
BEGIN
  FOR r IN SELECT * FROM public.raffles WHERE status = 'open' AND week_start + INTERVAL '7 days' <= now() LOOP
    SELECT e.user_id, p.full_name, p.email
      INTO w
      FROM public.raffle_entries e
      LEFT JOIN public.profiles p ON p.id = e.user_id
     WHERE e.raffle_id = r.id
     ORDER BY random()
     LIMIT 1;

    IF w.user_id IS NULL THEN
      UPDATE public.raffles SET status = 'closed', drawn_at = now() WHERE id = r.id;
    ELSE
      UPDATE public.raffles
         SET status = 'drawn',
             drawn_at = now(),
             winner_user_id = w.user_id,
             winner_label = COALESCE(NULLIF(split_part(COALESCE(w.full_name, ''), ' ', 1), ''), split_part(COALESCE(w.email, 'cliente'), '@', 1))
       WHERE id = r.id;
      INSERT INTO public.points_ledger (user_id, delta, reason) VALUES (w.user_id, 100, 'raffle_win');
      UPDATE public.profiles SET points = points + 100 WHERE id = w.user_id;
    END IF;
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.draw_weekly_raffle() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.draw_weekly_raffle() TO service_role;

INSERT INTO public.raffles (week_start, title, prize, prize_brand, status)
VALUES (date_trunc('week', now())::date, 'Sorteio da semana', 'Wera Tool-Check PLUS', 'Wera', 'open');