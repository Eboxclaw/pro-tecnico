-- REJENDARI referrals: attribution first, points rewards only after a campaign condition is met.
-- No referral point amount is hard-coded here. A trusted service may award the configured
-- amount later through award_referral_points(...).

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS referral_code TEXT,
  ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL;

UPDATE public.profiles
SET referral_code = upper(substr(md5(id::text), 1, 10))
WHERE referral_code IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS profiles_referral_code_key
  ON public.profiles (referral_code);

ALTER TABLE public.profiles
  ALTER COLUMN referral_code SET NOT NULL;

-- Users may edit profile contact fields, but points and referral attribution are server-owned.
REVOKE UPDATE ON public.profiles FROM authenticated;
GRANT UPDATE (full_name, company, vat_number, phone) ON public.profiles TO authenticated;

CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  referrer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'signed_up'
    CHECK (status IN ('signed_up', 'qualified', 'rewarded', 'cancelled')),
  referrer_points INTEGER NOT NULL DEFAULT 0 CHECK (referrer_points >= 0),
  referred_points INTEGER NOT NULL DEFAULT 0 CHECK (referred_points >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  qualified_at TIMESTAMPTZ,
  rewarded_at TIMESTAMPTZ,
  CHECK (referrer_id <> referred_user_id)
);

GRANT SELECT ON public.referrals TO authenticated;
GRANT ALL ON public.referrals TO service_role;

ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "referrals_select_own" ON public.referrals;
CREATE POLICY "referrals_select_own"
ON public.referrals
FOR SELECT
TO authenticated
USING (auth.uid() = referrer_id OR auth.uid() = referred_user_id);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral_code TEXT;
  v_referrer UUID;
  v_own_code TEXT;
BEGIN
  v_own_code := upper(substr(md5(NEW.id::text), 1, 10));
  v_referral_code := upper(NULLIF(trim(NEW.raw_user_meta_data->>'referred_by_code'), ''));

  IF v_referral_code IS NOT NULL THEN
    SELECT id
      INTO v_referrer
      FROM public.profiles
     WHERE referral_code = v_referral_code
     LIMIT 1;
  END IF;

  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    points,
    referral_code,
    referred_by
  )
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    50,
    v_own_code,
    v_referrer
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.points_ledger (user_id, delta, reason)
  VALUES (NEW.id, 50, 'signup_bonus');

  IF v_referrer IS NOT NULL AND v_referrer <> NEW.id THEN
    INSERT INTO public.referrals (referrer_id, referred_user_id, code)
    VALUES (v_referrer, NEW.id, v_referral_code)
    ON CONFLICT (referred_user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.claim_referral(p_code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user UUID := auth.uid();
  v_code TEXT := upper(NULLIF(trim(p_code), ''));
  v_referrer UUID;
  v_existing UUID;
BEGIN
  IF v_user IS NULL OR v_code IS NULL THEN
    RETURN FALSE;
  END IF;

  SELECT referred_by
    INTO v_existing
    FROM public.profiles
   WHERE id = v_user
   FOR UPDATE;

  IF v_existing IS NOT NULL THEN
    RETURN FALSE;
  END IF;

  SELECT id
    INTO v_referrer
    FROM public.profiles
   WHERE referral_code = v_code
     AND id <> v_user
   LIMIT 1;

  IF v_referrer IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.profiles
     SET referred_by = v_referrer
   WHERE id = v_user
     AND referred_by IS NULL;

  INSERT INTO public.referrals (referrer_id, referred_user_id, code)
  VALUES (v_referrer, v_user, v_code)
  ON CONFLICT (referred_user_id) DO NOTHING;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.claim_referral(TEXT) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_referral(TEXT) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.award_referral_points(
  p_referral_id UUID,
  p_referrer_points INTEGER,
  p_referred_points INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_referral public.referrals%ROWTYPE;
BEGIN
  IF p_referrer_points < 0 OR p_referred_points < 0 THEN
    RAISE EXCEPTION 'Referral rewards cannot be negative';
  END IF;

  SELECT *
    INTO v_referral
    FROM public.referrals
   WHERE id = p_referral_id
   FOR UPDATE;

  IF v_referral.id IS NULL OR v_referral.status = 'rewarded' THEN
    RETURN FALSE;
  END IF;

  IF p_referrer_points > 0 THEN
    INSERT INTO public.points_ledger (user_id, delta, reason)
    VALUES (v_referral.referrer_id, p_referrer_points, 'referral_reward');

    UPDATE public.profiles
       SET points = points + p_referrer_points
     WHERE id = v_referral.referrer_id;
  END IF;

  IF p_referred_points > 0 THEN
    INSERT INTO public.points_ledger (user_id, delta, reason)
    VALUES (v_referral.referred_user_id, p_referred_points, 'referral_welcome_reward');

    UPDATE public.profiles
       SET points = points + p_referred_points
     WHERE id = v_referral.referred_user_id;
  END IF;

  UPDATE public.referrals
     SET status = 'rewarded',
         referrer_points = p_referrer_points,
         referred_points = p_referred_points,
         qualified_at = COALESCE(qualified_at, now()),
         rewarded_at = now()
   WHERE id = p_referral_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.award_referral_points(UUID, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.award_referral_points(UUID, INTEGER, INTEGER)
  TO service_role;
