/*
  # Vendor Authentication Setup

  1. New Tables
    - vendor_users
      - id (uuid, primary key)
      - email (text, unique)
      - created_at (timestamptz)
      - status (text)

  2. Security
    - Enable RLS
    - Add policies for vendor access
*/

-- Create vendor_users table
CREATE TABLE IF NOT EXISTS vendor_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('active', 'inactive', 'suspended'))
);

-- Enable RLS
ALTER TABLE vendor_users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Vendors can read own data"
  ON vendor_users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create test vendor user
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
  '11111111-1111-1111-1111-111111111111',
  'authenticated',
  'authenticated',
  'vendor@example.com',
  crypt('Vendor@123', gen_salt('bf')),
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
ON CONFLICT (id) DO NOTHING;

-- Add vendor to vendor_users
INSERT INTO vendor_users (id, email)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'vendor@example.com'
)
ON CONFLICT (email) DO NOTHING;
