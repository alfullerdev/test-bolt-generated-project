-- Drop all authentication related functions
DROP FUNCTION IF EXISTS get_user_type(text);

-- Drop all authentication related tables
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS vendor_users CASCADE;

-- Clean up auth schema
DO $$
BEGIN
  -- Delete all users from auth.users
  DELETE FROM auth.users;
  
  -- Reset vendors table but keep structure
  TRUNCATE TABLE vendors CASCADE;
END $$;

-- Remove any auth-related policies
DROP POLICY IF EXISTS "Anyone can check user type" ON vendors;
DROP POLICY IF EXISTS "Vendors can read own data" ON vendors;
DROP POLICY IF EXISTS "Vendors can update own records" ON vendors;
DROP POLICY IF EXISTS "Allow public to create vendors" ON vendors;

-- Create new public policy for vendors table
CREATE POLICY "Public access" ON vendors
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled but allow public access
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
