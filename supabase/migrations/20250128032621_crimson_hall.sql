-- Create function to get user type
CREATE OR REPLACE FUNCTION get_user_type(user_email TEXT)
RETURNS TABLE (user_type TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
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
    ELSE
      RETURN QUERY SELECT 'admin'::TEXT;
    END IF;
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

  -- If no type found, return user
  RETURN QUERY SELECT 'user'::TEXT;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_type(TEXT) TO authenticated;
