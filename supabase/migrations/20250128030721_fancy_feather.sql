-- Create storage bucket for user photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('user_photos', 'user_photos', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on the bucket
CREATE POLICY "Users can upload their own photos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'user_photos' AND
  (auth.uid())::text = (SPLIT_PART(name, '/', 1))
);

-- Allow users to read their own photos
CREATE POLICY "Users can read their own photos"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'user_photos' AND
  (auth.uid())::text = (SPLIT_PART(name, '/', 1))
);

-- Allow users to delete their own photos
CREATE POLICY "Users can delete their own photos"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'user_photos' AND
  (auth.uid())::text = (SPLIT_PART(name, '/', 1))
);

-- Add photo_url column to user_management view
DROP VIEW IF EXISTS user_management;
CREATE VIEW user_management AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN adm.id IS NOT NULL THEN 'admin'
    WHEN vu.id IS NOT NULL THEN 'vendor'
    ELSE 'user'
  END as user_type,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  COALESCE(au.raw_user_meta_data->>'photo_url', '') as photo_url,
  au.last_sign_in_at,
  au.confirmed_at as email_confirmed_at
FROM auth.users au
LEFT JOIN admin_users adm ON au.id = adm.id
LEFT JOIN vendor_users vu ON au.id = vu.id;
