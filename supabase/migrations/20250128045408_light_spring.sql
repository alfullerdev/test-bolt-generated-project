-- Create new admin user or update existing
DO $$
DECLARE
  v_admin_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO v_admin_id
  FROM auth.users
  WHERE email = 'sharif@hawaiifest.com';

  IF v_admin_id IS NULL THEN
    -- Generate new UUID for admin if user doesn't exist
    v_admin_id := gen_random_uuid();

    -- Create new admin user
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
      'sharif@hawaiifest.com',
      crypt('3Sasdfm3221@@', gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}'::jsonb,
      '{"role": "admin"}'::jsonb,
      now(),
      now(),
      '',
      ''
    );
  ELSE
    -- Update existing user's password and role
    UPDATE auth.users
    SET 
      encrypted_password = crypt('3Sasdfm3221@@', gen_salt('bf')),
      raw_user_meta_data = '{"role": "admin"}'::jsonb,
      updated_at = now()
    WHERE id = v_admin_id;
  END IF;

  -- Ensure user is in admin_users table
  INSERT INTO admin_users (id, email)
  VALUES (v_admin_id, 'sharif@hawaiifest.com')
  ON CONFLICT (id) DO NOTHING;

END $$;
