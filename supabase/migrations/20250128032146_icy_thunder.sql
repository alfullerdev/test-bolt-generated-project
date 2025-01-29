-- Update user_management view to include 'user' type
DROP VIEW IF EXISTS user_management;
CREATE VIEW user_management AS
SELECT 
  au.id,
  au.email,
  au.created_at,
  CASE 
    WHEN adm.id IS NOT NULL AND au.raw_user_meta_data->>'role' = 'hnic' THEN 'hnic'
    WHEN adm.id IS NOT NULL THEN 'admin'
    WHEN vu.id IS NOT NULL THEN 'vendor'
    ELSE 'user'
  END as user_type,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  COALESCE(au.raw_user_meta_data->>'photo_url', '') as photo_url,
  au.last_sign_in_at,
  au.confirmed_at as email_confirmed_at
FROM auth.users au
LEFT JOIN admin_users adm ON au.id = adm.id
LEFT JOIN vendor_users vu ON au.id = vu.id;

-- Update update_user function to handle email and password changes
CREATE OR REPLACE FUNCTION update_user(
  p_user_id uuid,
  p_email text,
  p_password text,
  p_full_name text,
  p_user_type text
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only admin users can update users';
  END IF;

  -- Validate user type
  IF p_user_type NOT IN ('hnic', 'admin', 'vendor', 'user') THEN
    RAISE EXCEPTION 'Invalid user type. Must be hnic, admin, vendor, or user';
  END IF;

  -- Update user email and password if provided
  UPDATE auth.users
  SET 
    email = COALESCE(p_email, email),
    encrypted_password = CASE 
      WHEN p_password IS NOT NULL THEN crypt(p_password, gen_salt('bf'))
      ELSE encrypted_password
    END,
    raw_user_meta_data = jsonb_set(
      COALESCE(raw_user_meta_data, '{}'::jsonb),
      '{full_name}',
      to_jsonb(p_full_name)
    ),
    updated_at = now()
  WHERE id = p_user_id;

  -- Update user type
  CASE p_user_type
    WHEN 'vendor' THEN
      -- Remove from admin_users if exists
      DELETE FROM admin_users WHERE id = p_user_id;
      -- Add to vendor_users if not exists
      INSERT INTO vendor_users (id, email)
      SELECT id, email FROM auth.users WHERE id = p_user_id
      ON CONFLICT (id) DO NOTHING;
      -- Remove HNIC role
      UPDATE auth.users
      SET raw_user_meta_data = raw_user_meta_data - 'role'
      WHERE id = p_user_id;
    WHEN 'user' THEN
      -- Remove from both admin_users and vendor_users
      DELETE FROM admin_users WHERE id = p_user_id;
      DELETE FROM vendor_users WHERE id = p_user_id;
      -- Remove HNIC role
      UPDATE auth.users
      SET raw_user_meta_data = raw_user_meta_data - 'role'
      WHERE id = p_user_id;
    ELSE
      -- Remove from vendor_users if exists
      DELETE FROM vendor_users WHERE id = p_user_id;
      -- Add to admin_users if not exists
      INSERT INTO admin_users (id, email)
      SELECT id, email FROM auth.users WHERE id = p_user_id
      ON CONFLICT (id) DO NOTHING;
      -- Update HNIC role if applicable
      UPDATE auth.users
      SET raw_user_meta_data = jsonb_set(
        COALESCE(raw_user_meta_data, '{}'::jsonb),
        '{role}',
        CASE WHEN p_user_type = 'hnic' THEN '"hnic"' ELSE 'null' END::jsonb
      )
      WHERE id = p_user_id;
  END CASE;
END;
$$;

-- Update add_admin_user function to include user type
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
    ELSE
      -- For regular users, no additional table entry needed
      NULL;
  END CASE;

  RETURN v_user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user(uuid, text, text, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION add_admin_user(text, text, text, text) TO authenticated;
