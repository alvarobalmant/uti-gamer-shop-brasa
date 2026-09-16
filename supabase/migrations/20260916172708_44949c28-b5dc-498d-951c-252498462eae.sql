-- Fix anon navigation broken after revoking anon access to user_profiles:
-- the admin policy on navigation_items used an inline subquery on user_profiles,
-- which now fails with permission denied. Use the security definer is_admin() instead.
DROP POLICY IF EXISTS navigation_items_admin_policy ON public.navigation_items;

CREATE POLICY navigation_items_admin_policy
ON public.navigation_items
FOR ALL
TO authenticated
USING (public.is_admin(auth.uid()))
WITH CHECK (public.is_admin(auth.uid()));