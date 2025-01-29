-- Update add_admin_user function to handle user type
CREATE OR REPLACE FUNCTION add_admin_user(
  p_email text,
  p_password text,
  p_full_name text DEFAULT NULL,
  p_user_type text DEFAULT 'admin'
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
  IF p_user_type NOT IN ('hnic', 'admin', 'vendor') THEN
    RAISE EXCEPTION 'Invalid user type. Must be hnic, admin, or vendor';
  END IF;

  -- Create user in auth.users
  INSERT INTO auth.users (
    email,
    encrypted_password,
    email_confirmed_at,
    raw_user_meta_data,
    created_at,
    updated_at
  )
  VALUES (
    p_email,
    crypt(p_password, gen_salt('bf')),
    now(),
    jsonb_build_object(
      'full_name', p_full_name,
      'role', CASE WHEN p_user_type = 'hnic' THEN 'hnic' ELSE NULL END
    ),
    now(),
    now()
  )
  RETURNING id INTO v_user_id;

  -- Add to appropriate user table based on type
  CASE p_user_type
    WHEN 'hnic' THEN
      INSERT INTO admin_users (id, email) VALUES (v_user_id, p_email);
    WHEN 'admin' THEN
      INSERT INTO admin_users (id, email) VALUES (v_user_id, p_email);
    WHEN 'vendor' THEN
      INSERT INTO vendor_users (id, email) VALUES (v_user_id, p_email);
  END CASE;

  RETURN v_user_id;
END;
$$;
