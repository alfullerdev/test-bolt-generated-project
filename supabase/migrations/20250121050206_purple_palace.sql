-- Create admin user in auth.users
CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
  admin_uid uuid;
BEGIN
  -- Insert into auth.users if not exists
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
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@bev.merch.food',
    crypt('Global@5991', gen_salt('bf')),
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
  )
  ON CONFLICT (id) DO NOTHING
  RETURNING id INTO admin_uid;

  -- Ensure admin exists in admin_users table
  INSERT INTO admin_users (id, email)
  VALUES (
    '00000000-0000-0000-0000-000000000000',
    'admin@bev.merch.food'
  )
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT create_admin_user();
