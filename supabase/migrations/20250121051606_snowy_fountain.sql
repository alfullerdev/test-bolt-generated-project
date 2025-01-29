/*
  # Fix Vendor Authentication

  1. Changes
    - Recreate vendor user with proper authentication
    - Add missing RLS policies
    - Fix user type function
*/

-- Recreate vendor user with proper credentials
DO $$ 
BEGIN
  -- Delete existing vendor user if exists
  DELETE FROM auth.users WHERE email = 'vendor@example.com';
  DELETE FROM vendor_users WHERE email = 'vendor@example.com';

  -- Create new vendor user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'vendor@example.com',
    crypt('Vendor@123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
  );

  -- Add vendor to vendor_users
  INSERT INTO vendor_users (id, email)
  VALUES (
    '11111111-1111-1111-1111-111111111111',
    'vendor@example.com'
  );
END $$;

-- Update get_user_type function to be more robust
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
    AND email = ANY(SELECT email FROM auth.users WHERE email = user_email)
  ) THEN
    RETURN QUERY SELECT 'admin'::TEXT;
    RETURN;
  END IF;

  -- Then check if user is a vendor
  IF EXISTS (
    SELECT 1 FROM vendor_users 
    WHERE email = user_email
    AND email = ANY(SELECT email FROM auth.users WHERE email = user_email)
  ) THEN
    RETURN QUERY SELECT 'vendor'::TEXT;
    RETURN;
  END IF;

  -- If no type found, return null
  RETURN QUERY SELECT NULL::TEXT;
END;
$$;

-- Ensure proper RLS policies
DROP POLICY IF EXISTS "Vendors can read own data" ON vendor_users;
CREATE POLICY "Vendors can read own data"
  ON vendor_users
  FOR SELECT
  TO authenticated
  USING (
    email = auth.jwt() ->> 'email'
    OR 
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );
