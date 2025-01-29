-- Drop all custom auth functions and tables
DROP FUNCTION IF EXISTS get_user_type(text);
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS vendor_users CASCADE;

-- Clean up auth schema and create admin user
DO $$
DECLARE
  v_admin_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
  -- Delete all users first to start fresh
  DELETE FROM auth.users;

  -- Create admin user with proper credentials
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
    v_admin_id,
    'authenticated',
    'authenticated',
    'admin@bev.merch.food',
    crypt('Global@5991', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"role": "admin"}'::jsonb,
    now(),
    now()
  );

  -- Create test vendor user
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
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'vendor@example.com',
    crypt('Vendor@123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"role": "vendor"}'::jsonb,
    now(),
    now()
  );

  -- Ensure proper RLS policies for vendors
  ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

  DROP POLICY IF EXISTS "Public read access" ON vendors;
  CREATE POLICY "Public read access" ON vendors
    FOR SELECT
    TO public
    USING (true);

  DROP POLICY IF EXISTS "Authenticated users can create vendors" ON vendors;
  CREATE POLICY "Authenticated users can create vendors" ON vendors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

  DROP POLICY IF EXISTS "Authenticated users can update own vendor records" ON vendors;
  CREATE POLICY "Authenticated users can update own vendor records" ON vendors
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA auth TO anon, authenticated;
  GRANT SELECT ON auth.users TO anon, authenticated;
END $$;
