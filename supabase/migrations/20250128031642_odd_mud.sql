-- Drop existing view
DROP VIEW IF EXISTS user_management;

-- Update user_management view to include HNIC type
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

-- Update admin@bev.merch.food to HNIC role
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{role}',
  '"hnic"'
)
WHERE email = 'admin@bev.merch.food';
