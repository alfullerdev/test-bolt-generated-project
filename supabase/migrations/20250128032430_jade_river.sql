-- Drop existing function
DROP FUNCTION IF EXISTS add_admin_user(text, text, text, text);

-- Create improved add_admin_user function with proper ID handling
CREATE OR REPLACE FUNCTION add_admin_user(
  p_email text,
  p_password text,
  p_full_name text DEFAULT NULL,
  p_user_type text DEFAULT 'user'
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_user_id uuid;
BEGIN
  -- Check if caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only admin users can add new users';
  END IF;

  -- Validate user type
  IF p_user_type NOT IN ('hnic', 'admin', 'vendor', 'user') THEN
    RAISE EXCEPTION 'Invalid user type. Must be hnic, admin, vendor, or user';
  END IF;

  -- Generate UUID for new user
  v_user_id := gen_random_uuid();

  -- Create user in auth.users
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
  )
  VALUES (
    '00000000-0000-0000-0000-000000000000',  -- default instance_id
    v_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    jsonb_build_object(
      'full_name', p_full_name,
      'role', CASE WHEN p_user_type = 'hnic' THEN 'hnic' ELSE NULL END
    ),
    now(),
    now()
  );

  -- Add to appropriate user table based on type
  CASE p_user_type
    WHEN 'hnic' THEN
      INSERT INTO admin_users (id, email) VALUES (v_user_id, p_email);
    WHEN 'admin' THEN
      INSERT INTO admin_users (id, email) VALUES (v_user_id, p_email);
    WHEN 'vendor' THEN
      INSERT INTO vendor_users (id, email) VALUES (v_user_id, p_email);
    ELSE
      -- For regular users, no additional table entry needed
      NULL;
  END CASE;

  RETURN v_user_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION add_admin_user(text, text, text, text) TO authenticated;
