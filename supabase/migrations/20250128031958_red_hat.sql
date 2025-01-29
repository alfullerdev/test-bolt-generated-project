-- Create function to update user
CREATE OR REPLACE FUNCTION update_user(
  p_user_id uuid,
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
  IF p_user_type NOT IN ('hnic', 'admin', 'vendor') THEN
    RAISE EXCEPTION 'Invalid user type. Must be hnic, admin, or vendor';
  END IF;

  -- Update user metadata
  UPDATE auth.users
  SET raw_user_meta_data = jsonb_set(
    COALESCE(raw_user_meta_data, '{}'::jsonb),
    '{full_name}',
    to_jsonb(p_full_name)
  )
  WHERE id = p_user_id;

  -- Update user type if changed
  IF p_user_type = 'vendor' THEN
    -- Remove from admin_users if exists
    DELETE FROM admin_users WHERE id = p_user_id;
    -- Add to vendor_users if not exists
    INSERT INTO vendor_users (id, email)
    SELECT id, email FROM auth.users WHERE id = p_user_id
    ON CONFLICT (id) DO NOTHING;
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
  END IF;
END;
$$;

-- Create function to delete user
CREATE OR REPLACE FUNCTION delete_user(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Check if caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Only admin users can delete users';
  END IF;

  -- Delete from auth.users (this will cascade to other tables)
  DELETE FROM auth.users WHERE id = p_user_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION update_user(uuid, text, text) TO authenticated;
GRANT EXECUTE ON FUNCTION delete_user(uuid) TO authenticated;
