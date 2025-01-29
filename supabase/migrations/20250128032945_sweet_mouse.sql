-- Drop existing function
DROP FUNCTION IF EXISTS get_user_type(text);

-- Create improved get_user_type function with proper schema access
CREATE OR REPLACE FUNCTION get_user_type(user_email TEXT)
RETURNS TABLE (user_type TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Get user ID first to ensure user exists
  SELECT id INTO v_user_id
  FROM auth.users 
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found';
  END IF;

  -- First check if user is an admin
  IF EXISTS (
    SELECT 1 FROM admin_users 
    WHERE id = v_user_id
  ) THEN
    -- Check if user is HNIC
    IF EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = v_user_id 
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
    WHERE id = v_user_id
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
DECLARE
  v_admin_id uuid;
BEGIN
  -- Get or create admin user
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = 'admin@bev.merch.food';

  IF NOT FOUND THEN
    -- Create admin user if not exists
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
      updated_at
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
      now()
    )
    RETURNING id INTO v_admin_id;
  ELSE
    -- Update existing admin user
    UPDATE auth.users
    SET 
      raw_user_meta_data = '{"role": "hnic"}'::jsonb,
      updated_at = now()
    WHERE id = v_admin_id;
  END IF;

  -- Ensure admin exists in admin_users
  INSERT INTO admin_users (id, email)
  VALUES (v_admin_id, 'admin@bev.merch.food')
  ON CONFLICT (id) DO NOTHING;

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA auth TO authenticated;
  GRANT SELECT ON auth.users TO authenticated;
END $$;
