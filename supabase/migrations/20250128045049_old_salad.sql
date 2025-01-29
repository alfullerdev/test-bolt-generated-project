-- Drop existing view if exists
DROP VIEW IF EXISTS user_management;

-- Create improved user_management view
CREATE OR REPLACE VIEW user_management AS
WITH user_types AS (
  SELECT 
    au.id,
    au.email,
    CASE 
      WHEN adm.id IS NOT NULL AND au.raw_user_meta_data->>'role' = 'hnic' THEN 'hnic'
      WHEN adm.id IS NOT NULL THEN 'admin'
      WHEN vu.id IS NOT NULL THEN 'vendor'
      ELSE 'user'
    END as user_type
  FROM auth.users au
  LEFT JOIN admin_users adm ON au.id = adm.id
  LEFT JOIN vendor_users vu ON au.id = vu.id
)
SELECT 
  au.id,
  au.email,
  au.created_at,
  ut.user_type,
  COALESCE(au.raw_user_meta_data->>'full_name', '') as full_name,
  COALESCE(au.raw_user_meta_data->>'photo_url', '') as photo_url,
  au.last_sign_in_at,
  au.confirmed_at as email_confirmed_at
FROM auth.users au
JOIN user_types ut ON au.id = ut.id;

-- Create a secure wrapper function to access user management data
CREATE OR REPLACE FUNCTION get_user_management_data(p_user_id uuid DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  email text,
  created_at timestamptz,
  user_type text,
  full_name text,
  photo_url text,
  last_sign_in_at timestamptz,
  email_confirmed_at timestamptz
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if caller is admin
  IF EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ) THEN
    -- Admins can see all users
    RETURN QUERY 
    SELECT * FROM user_management
    WHERE p_user_id IS NULL OR user_management.id = p_user_id;
  ELSE
    -- Regular users can only see their own data
    RETURN QUERY 
    SELECT * FROM user_management 
    WHERE id = auth.uid()
    AND (p_user_id IS NULL OR user_management.id = p_user_id);
  END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_management_data(uuid) TO authenticated;

-- Ensure admin user exists with proper role
DO $$
DECLARE
  v_admin_id uuid := '00000000-0000-0000-0000-000000000000';
BEGIN
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
    '{"role": "hnic"}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    raw_user_meta_data = '{"role": "hnic"}'::jsonb,
    updated_at = now();

  -- Ensure admin exists in admin_users
  INSERT INTO admin_users (id, email)
  VALUES (v_admin_id, 'admin@bev.merch.food')
  ON CONFLICT (id) DO NOTHING;
END $$;
