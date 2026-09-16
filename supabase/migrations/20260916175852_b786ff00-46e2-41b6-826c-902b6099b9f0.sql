-- 1) Analytics inserts: only anonymous rows or own user_id
DROP POLICY IF EXISTS "Anyone can insert customer_events" ON public.customer_events;
CREATE POLICY "Insert own or anonymous customer_events"
ON public.customer_events FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

DROP POLICY IF EXISTS "Anyone can insert cart_abandonment" ON public.cart_abandonment;
CREATE POLICY "Insert own or anonymous cart_abandonment"
ON public.cart_abandonment FOR INSERT TO anon, authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid());

-- 2) Security logs / flags: server-side only
DROP POLICY IF EXISTS "System can insert security logs" ON public.security_logs;
CREATE POLICY "Service role can insert security logs"
ON public.security_logs FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.security_logs FROM anon, authenticated;

DROP POLICY IF EXISTS "System can insert security flags" ON public.security_flags;
CREATE POLICY "Service role can insert security flags"
ON public.security_flags FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.security_flags FROM anon, authenticated;

-- 3) Order verification codes: created only via SECURITY DEFINER RPC / service role
DROP POLICY IF EXISTS "System can insert codes" ON public.order_verification_codes;
CREATE POLICY "Service role can insert order codes"
ON public.order_verification_codes FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.order_verification_codes FROM anon, authenticated;

-- 4) Bonus claims: inserted only by the secure edge function
DROP POLICY IF EXISTS "System can insert claims" ON public.user_bonus_claims;
CREATE POLICY "Service role can insert bonus claims"
ON public.user_bonus_claims FOR INSERT TO service_role WITH CHECK (true);
REVOKE INSERT ON public.user_bonus_claims FROM anon, authenticated;

-- 5) pro_codes: no broad read for logged-in users
DROP POLICY IF EXISTS "Anyone can view pro codes if logged in" ON public.pro_codes;
DROP POLICY IF EXISTS "Admins can view pro codes" ON public.pro_codes;
CREATE POLICY "Admins can view pro codes"
ON public.pro_codes FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));
REVOKE SELECT ON public.pro_codes FROM anon;

-- 6) quick_links: admin-only writes
DROP POLICY IF EXISTS "Allow admin access" ON public.quick_links;

-- 7) promotional_ribbon_config: admin-only writes
DROP POLICY IF EXISTS "Allow authenticated users to insert" ON public.promotional_ribbon_config;
DROP POLICY IF EXISTS "Allow authenticated users to update" ON public.promotional_ribbon_config;
CREATE POLICY "Admins can insert ribbon config"
ON public.promotional_ribbon_config FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update ribbon config"
ON public.promotional_ribbon_config FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));

-- 8) subscription_plans: admin-only writes
DROP POLICY IF EXISTS "Allow authenticated users to insert into subscription_plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Allow authenticated users to update subscription_plans" ON public.subscription_plans;
DROP POLICY IF EXISTS "Allow authenticated users to delete from subscription_plans" ON public.subscription_plans;
CREATE POLICY "Admins can insert subscription plans"
ON public.subscription_plans FOR INSERT TO authenticated
WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can update subscription plans"
ON public.subscription_plans FOR UPDATE TO authenticated
USING (public.is_admin(auth.uid())) WITH CHECK (public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete subscription plans"
ON public.subscription_plans FOR DELETE TO authenticated
USING (public.is_admin(auth.uid()));

-- 9) realtime_dashboard_cache: enable RLS, admins only
ALTER TABLE public.realtime_dashboard_cache ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.realtime_dashboard_cache FROM anon, authenticated;
GRANT SELECT ON public.realtime_dashboard_cache TO authenticated;
GRANT ALL ON public.realtime_dashboard_cache TO service_role;
CREATE POLICY "Admins can view dashboard cache"
ON public.realtime_dashboard_cache FOR SELECT TO authenticated
USING (public.is_admin(auth.uid()));
