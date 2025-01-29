-- Create user management view
CREATE OR REPLACE VIEW user_management AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN au.raw_user_meta_data->>'role' = 'admin' THEN 'admin'
    WHEN EXISTS (
      SELECT 1 FROM vendors v 
      WHERE v.email = au.email
    ) THEN 'vendor'
    ELSE 'user'
  END as user_type,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  COALESCE(au.raw_user_meta_data->>'photo_url', '') as photo_url,
  au.last_sign_in_at,
  au.confirmed_at as email_confirmed_at
FROM auth.users au;

-- Grant proper permissions
GRANT SELECT ON user_management TO authenticated;

-- Create RLS policy for the view
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to vendors
DROP POLICY IF EXISTS "Public read access" ON vendors;
CREATE POLICY "Public read access" ON vendors
  FOR SELECT
  TO public
  USING (true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO anon, authenticated;
