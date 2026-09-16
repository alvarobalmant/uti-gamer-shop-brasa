-- Keep admin checks usable inside policies evaluated for visitors
DO $$
DECLARE r record;
BEGIN
  FOR r IN
    SELECT p.oid::regprocedure AS sig FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public' AND p.proname IN ('is_admin','is_admin_user','is_user_admin','get_user_role','has_role')
  LOOP
    EXECUTE format('GRANT EXECUTE ON FUNCTION %s TO anon', r.sig);
  END LOOP;
END $$;

-- navigation-icons: public writes -> admin only
DROP POLICY IF EXISTS "Public upload access for navigation-icons" ON storage.objects;
DROP POLICY IF EXISTS "Public update access for navigation-icons" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access for navigation-icons" ON storage.objects;
CREATE POLICY "Admins can upload navigation-icons"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'navigation-icons' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update navigation-icons"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'navigation-icons' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'navigation-icons' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete navigation-icons"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'navigation-icons' AND public.is_admin(auth.uid()));

-- quick-link-icons: authenticated writes -> admin only
DROP POLICY IF EXISTS "Allow authenticated users to upload quick-link-icons" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update quick-link-icons" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to delete quick-link-icons" ON storage.objects;
CREATE POLICY "Admins can upload quick-link-icons"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'quick-link-icons' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update quick-link-icons"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'quick-link-icons' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'quick-link-icons' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete quick-link-icons"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'quick-link-icons' AND public.is_admin(auth.uid()));

-- site-images: authenticated writes -> admin only
DROP POLICY IF EXISTS "Allow authenticated uploads to site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes to site-images" ON storage.objects;
CREATE POLICY "Admins can upload site-images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'site-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can update site-images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'site-images' AND public.is_admin(auth.uid()))
WITH CHECK (bucket_id = 'site-images' AND public.is_admin(auth.uid()));
CREATE POLICY "Admins can delete site-images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'site-images' AND public.is_admin(auth.uid()));
