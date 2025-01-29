/*
  # Fix Authentication Flow

  1. New Functions
    - get_user_type: Determines if a user is an admin or vendor
  
  2. Changes
    - Add function to safely check user type without 406 errors
*/

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

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_type(TEXT) TO authenticated;
