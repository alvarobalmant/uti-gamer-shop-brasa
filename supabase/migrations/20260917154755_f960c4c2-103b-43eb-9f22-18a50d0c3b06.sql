-- 1) coin_system_config: no public/anon read
DROP POLICY IF EXISTS "Everyone can view config" ON public.coin_system_config;
CREATE POLICY "Authenticated users can view coin config"
ON public.coin_system_config FOR SELECT TO authenticated USING (true);
REVOKE SELECT ON public.coin_system_config FROM anon;
GRANT SELECT ON public.coin_system_config TO authenticated;
GRANT ALL ON public.coin_system_config TO service_role;

-- 2) email_config: admin only
DROP POLICY IF EXISTS "Everyone can read email config" ON public.email_config;
CREATE POLICY "Admins can read email config"
ON public.email_config FOR SELECT TO authenticated USING (public.is_admin());
REVOKE SELECT ON public.email_config FROM anon;
GRANT SELECT ON public.email_config TO authenticated;
GRANT ALL ON public.email_config TO service_role;

-- 3) user_profiles: block self role escalation at policy level
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
CREATE POLICY "Users can update own profile"
ON public.user_profiles FOR UPDATE TO authenticated
USING (auth.uid() = id)
WITH CHECK (
  auth.uid() = id
  AND role IS NOT DISTINCT FROM (
    SELECT up.role FROM public.user_profiles up WHERE up.id = auth.uid()
  )
);