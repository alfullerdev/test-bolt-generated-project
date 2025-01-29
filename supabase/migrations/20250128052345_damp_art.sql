-- Drop and recreate the get_user_type function with proper schema permissions
DROP FUNCTION IF EXISTS get_user_type(text);

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

-- Grant proper schema permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT USAGE ON SCHEMA auth TO postgres, anon, authenticated, service_role;

-- Grant table permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO postgres, service_role;

-- Grant specific permissions to authenticated users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant specific permissions to anonymous users
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;

-- Ensure proper RLS policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_users ENABLE ROW LEVEL SECURITY;

-- Recreate RLS policies
DROP POLICY IF EXISTS "Anyone can check user type" ON admin_users;
CREATE POLICY "Anyone can check user type"
  ON admin_users
  FOR SELECT
  TO PUBLIC
  USING (true);

DROP POLICY IF EXISTS "Anyone can check vendor type" ON vendor_users;
CREATE POLICY "Anyone can check vendor type"
  ON vendor_users
  FOR SELECT
  TO PUBLIC
  USING (true);

-- Ensure proper function permissions
GRANT EXECUTE ON FUNCTION get_user_type(TEXT) TO anon, authenticated;

-- Recreate test users with proper credentials
DO $$
BEGIN
  -- Recreate admin user
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
    '00000000-0000-0000-0000-000000000000',
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
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    encrypted_password = crypt('Global@5991', gen_salt('bf')),
    raw_user_meta_data = '{"role": "hnic"}'::jsonb,
    updated_at = now();

  -- Ensure admin exists in admin_users
  INSERT INTO admin_users (id, email)
  VALUES ('00000000-0000-0000-0000-000000000000', 'admin@bev.merch.food')
  ON CONFLICT (id) DO NOTHING;

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

  -- Ensure vendor exists in vendor_users
  INSERT INTO vendor_users (id, email)
  VALUES ('11111111-1111-1111-1111-111111111111', 'vendor@example.com')
  ON CONFLICT (id) DO NOTHING;
END $$;
