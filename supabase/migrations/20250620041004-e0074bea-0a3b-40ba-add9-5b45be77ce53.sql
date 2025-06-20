
-- Remove any conflicting INSERT policies first
DROP POLICY IF EXISTS "Allow admin uploads" ON storage.objects;
DROP POLICY IF EXISTS "Admin can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Only admins can upload" ON storage.objects;

-- Remove existing policies to avoid conflicts
DROP POLICY IF EXISTS "Public access to site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated uploads to site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated updates to site-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated deletes to site-images" ON storage.objects;

-- Create the public SELECT policy for viewing images
CREATE POLICY "Public access to site-images" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'site-images');

-- Create the INSERT policy for authenticated users
CREATE POLICY "Allow authenticated uploads to site-images" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to update their uploads
CREATE POLICY "Allow authenticated updates to site-images" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'site-images' AND auth.role() = 'authenticated')
WITH CHECK (bucket_id = 'site-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY "Allow authenticated deletes to site-images" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'site-images' AND auth.role() = 'authenticated');
