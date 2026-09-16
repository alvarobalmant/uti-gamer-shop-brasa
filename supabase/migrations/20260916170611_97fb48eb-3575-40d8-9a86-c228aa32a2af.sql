-- Prevent privilege escalation via user_profiles.role
CREATE OR REPLACE FUNCTION public.protect_user_profile_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Only an existing admin may create a profile with a privileged role.
    IF COALESCE(NEW.role, 'user') <> 'user' AND NOT public.is_admin(auth.uid()) THEN
      NEW.role := 'user';
    END IF;
    RETURN NEW;
  END IF;

  -- UPDATE: role changes are admin-only; regular users keep their old role.
  IF NEW.role IS DISTINCT FROM OLD.role AND NOT public.is_admin(auth.uid()) THEN
    NEW.role := OLD.role;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS protect_user_profile_role_trg ON public.user_profiles;
CREATE TRIGGER protect_user_profile_role_trg
BEFORE INSERT OR UPDATE ON public.user_profiles
FOR EACH ROW EXECUTE FUNCTION public.protect_user_profile_role();

-- Tighten the INSERT policy: self-service profiles only, never privileged.
DROP POLICY IF EXISTS "System can insert profiles" ON public.user_profiles;
CREATE POLICY "Users can create own profile"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id AND COALESCE(role, 'user') = 'user');

-- Tighten the self-update policy with an explicit WITH CHECK.
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Admin policies scoped to authenticated role only.
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
CREATE POLICY "Admins can update all profiles"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
CREATE POLICY "Admins can view all profiles"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

REVOKE INSERT, UPDATE, DELETE ON public.user_profiles FROM anon;
REVOKE SELECT ON public.user_profiles FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.user_profiles TO authenticated;
GRANT ALL ON public.user_profiles TO service_role;