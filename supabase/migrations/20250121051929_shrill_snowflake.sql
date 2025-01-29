-- Update get_user_type function to be more efficient
CREATE OR REPLACE FUNCTION get_user_type(user_email TEXT)
RETURNS TABLE (user_type TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if user exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  ) THEN
    RETURN QUERY SELECT NULL::TEXT;
    RETURN;
  END IF;

  -- First check if user is an admin
  IF EXISTS (
    SELECT 1 FROM admin_users 
    WHERE email = user_email
  ) THEN
    RETURN QUERY SELECT 'admin'::TEXT;
    RETURN;
  END IF;

  -- Then check if user is a vendor
  IF EXISTS (
    SELECT 1 FROM vendor_users 
    WHERE email = user_email
  ) THEN
    RETURN QUERY SELECT 'vendor'::TEXT;
    RETURN;
  END IF;

  -- If no type found, return null
  RETURN QUERY SELECT NULL::TEXT;
END;
$$;

-- Ensure proper RLS policies
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
