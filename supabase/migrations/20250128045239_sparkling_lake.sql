-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_user_type(text);

-- Create improved get_user_type function
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
    -- Return user type instead of error
    RETURN QUERY SELECT 'user'::TEXT;
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

-- Recreate admin user with correct credentials
DO $$
DECLARE
  v_admin_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Delete existing admin user if exists
  DELETE FROM auth.users WHERE email = 'admin@bev.merch.food';
  DELETE FROM admin_users WHERE email = 'admin@bev.merch.food';

  -- Create admin user with correct credentials
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    v_admin_id,
    'authenticated',
    'authenticated',
    'admin@bev.merch.food',
    crypt('Global@5991', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"role": "hnic"}'::jsonb,
    now(),
    now(),
    '',
    ''
  );

  -- Add to admin_users table
  INSERT INTO admin_users (id, email)
  VALUES (v_admin_id, 'admin@bev.merch.food');

  -- Recreate vendor user
  INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'vendor@example.com',
    crypt('Vendor@123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET encrypted_password = crypt('Vendor@123', gen_salt('bf'));

  -- Add to vendor_users table
  INSERT INTO vendor_users (id, email)
  VALUES ('11111111-1111-1111-1111-111111111111', 'vendor@example.com')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Ensure proper permissions
GRANT USAGE ON SCHEMA auth TO authenticated;
GRANT SELECT ON auth.users TO authenticated;
