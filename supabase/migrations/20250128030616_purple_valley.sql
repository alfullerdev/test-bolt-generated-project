-- Create users view for easier management
CREATE OR REPLACE VIEW user_management AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN adm.id IS NOT NULL THEN 'admin'
    WHEN vu.id IS NOT NULL THEN 'vendor'
    ELSE 'user'
  END as user_type,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  au.last_sign_in_at,
  au.confirmed_at as email_confirmed_at
FROM auth.users au
LEFT JOIN admin_users adm ON au.id = adm.id
LEFT JOIN vendor_users vu ON au.id = vu.id;

-- Create function to add new admin user
CREATE OR REPLACE FUNCTION add_admin_user(
  p_email text,
  p_password text,
  p_full_name text DEFAULT NULL
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
    RAISE EXCEPTION 'Only admin users can add new admins';
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
    jsonb_build_object('full_name', p_full_name),
    now(),
    now()
  )
  RETURNING id INTO v_user_id;

  -- Add to admin_users
  INSERT INTO admin_users (id, email)
  VALUES (v_user_id, p_email);

  RETURN v_user_id;
END;
$$;

-- Grant permissions
GRANT SELECT ON user_management TO authenticated;
GRANT EXECUTE ON FUNCTION add_admin_user(text, text, text) TO authenticated;
