-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_user_type(text);

-- Create improved get_user_type function with better error handling
CREATE OR REPLACE FUNCTION get_user_type(user_email TEXT)
RETURNS TABLE (user_type TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if user exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  ) THEN
    -- Return null instead of raising an exception
    RETURN QUERY SELECT NULL::TEXT;
    RETURN;
  END IF;

  -- First check if user is an admin
  IF EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = user_email
  ) THEN
    -- Check if user is HNIC
    IF EXISTS (
      SELECT 1 FROM auth.users 
      WHERE email = user_email 
      AND raw_user_meta_data->>'role' = 'hnic'
    ) THEN
      RETURN QUERY SELECT 'hnic'::TEXT;
      RETURN;
    ELSE
      RETURN QUERY SELECT 'admin'::TEXT;
      RETURN;
    END IF;
  END IF;

  -- Then check if user is a vendor
  IF EXISTS (
    SELECT 1 FROM vendor_users 
    WHERE email = user_email
  ) THEN
    RETURN QUERY SELECT 'vendor'::TEXT;
    RETURN;
  END IF;

  -- If no specific type found, return user
  RETURN QUERY SELECT 'user'::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_type(TEXT) TO authenticated;

-- Ensure proper RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can check user type" ON admin_users;
CREATE POLICY "Anyone can check user type"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can check vendor type" ON vendor_users;
CREATE POLICY "Anyone can check vendor type"
  ON vendor_users
  FOR SELECT
  TO authenticated
  USING (true);

-- Ensure indexes exist for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_vendor_users_email ON vendor_users(email);

-- Ensure admin user exists with proper role
DO $$
BEGIN
  -- Update admin user if exists
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_build_object('role', 'hnic')
  WHERE email = 'admin@bev.merch.food';

  -- Ensure admin exists in admin_users
  INSERT INTO admin_users (id, email)
  SELECT id, email FROM auth.users WHERE email = 'admin@bev.merch.food'
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
