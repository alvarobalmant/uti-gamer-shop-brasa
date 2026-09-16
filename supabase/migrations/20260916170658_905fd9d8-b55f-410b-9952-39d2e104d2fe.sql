REVOKE EXECUTE ON FUNCTION public.protect_user_profile_role() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.protect_user_profile_role() TO service_role;