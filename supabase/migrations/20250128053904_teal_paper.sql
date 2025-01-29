-- Drop all custom auth functions and tables
DROP FUNCTION IF EXISTS get_user_type(text);
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS vendor_users CASCADE;

-- Clean up auth schema but keep admin user
DO $$
BEGIN
  -- Delete all users except admin
  DELETE FROM auth.users 
  WHERE email != 'admin@bev.merch.food';

  -- Create or update admin user
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
    '{"role": "admin"}'::jsonb,
    now(),
    now(),
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    encrypted_password = crypt('Global@5991', gen_salt('bf')),
    raw_user_meta_data = '{"role": "admin"}'::jsonb,
    updated_at = now();

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA auth TO anon, authenticated;
  GRANT SELECT ON auth.users TO anon, authenticated;
END $$;
