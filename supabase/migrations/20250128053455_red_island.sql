-- Drop existing function if exists
DROP FUNCTION IF EXISTS get_user_type(text);

-- Create simplified get_user_type function that uses auth.users metadata
CREATE OR REPLACE FUNCTION get_user_type(user_email TEXT)
RETURNS TABLE (user_type TEXT) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Check if user exists in auth.users
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = user_email
  ) THEN
    RETURN QUERY SELECT 'user'::TEXT;
    RETURN;
  END IF;

  -- Check user type from metadata
  RETURN QUERY
  SELECT 
    CASE 
      WHEN raw_user_meta_data->>'role' = 'admin' THEN 'admin'::TEXT
      WHEN EXISTS (
        SELECT 1 FROM vendors v 
        WHERE v.email = user_email
      ) THEN 'vendor'::TEXT
      ELSE 'user'::TEXT
    END
  FROM auth.users
  WHERE email = user_email;
END;
$$;

-- Grant proper permissions
GRANT USAGE ON SCHEMA auth TO anon, authenticated;
GRANT SELECT ON auth.users TO anon, authenticated;
GRANT EXECUTE ON FUNCTION get_user_type(TEXT) TO anon, authenticated;

-- Create test users with proper roles
DO $$
DECLARE
  v_vendor_id uuid;
BEGIN
  -- Create admin user
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

  -- Create vendor user
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
    '11111111-1111-1111-1111-111111111111',
    'authenticated',
    'authenticated',
    'vendor@example.com',
    crypt('Vendor@123', gen_salt('bf')),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{}'::jsonb,
    now(),
    now(),
    '',
    ''
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    encrypted_password = crypt('Vendor@123', gen_salt('bf')),
    updated_at = now()
  RETURNING id INTO v_vendor_id;

  -- Add vendor to vendors table
  INSERT INTO vendors (
    id,
    first_name,
    last_name,
    email,
    phone,
    business_name,
    business_type,
    get_license_number,
    website,
    description,
    cuisine_types,
    dietary_options,
    price_range,
    serving_capacity,
    menu_items,
    event_id,
    payment_intent_id,
    status,
    entry_type,
    payment_received
  ) VALUES (
    v_vendor_id,
    'Test',
    'Vendor',
    'vendor@example.com',
    '(555) 555-5555',
    'Test Vendor Business',
    'Restaurant',
    'GET123456',
    'https://example.com',
    'Test vendor description',
    '{}',
    '{}',
    50,
    100,
    '[]',
    '00000000-0000-0000-0000-000000000000',
    'test_payment_intent',
    'pending_approval',
    'manual',
    true
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    email = EXCLUDED.email,
    status = EXCLUDED.status;
END $$;
