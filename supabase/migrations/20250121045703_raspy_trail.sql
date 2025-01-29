/*
  # Admin User Setup

  1. New Tables
    - `admin_users` table for storing admin credentials
    - `vendor_stats` table for storing vendor statistics

  2. Security
    - Enable RLS on both tables
    - Add policies for admin access
*/

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users
CREATE POLICY "Admin users can access their own data"
  ON admin_users
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

-- Create vendor_stats table
CREATE TABLE IF NOT EXISTS vendor_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_vendors integer DEFAULT 0,
  active_vendors integer DEFAULT 0,
  pending_vendors integer DEFAULT 0,
  total_revenue numeric(10,2) DEFAULT 0,
  avg_order_value numeric(10,2) DEFAULT 0,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE vendor_stats ENABLE ROW LEVEL SECURITY;

-- Create policy for admin users to read vendor stats
CREATE POLICY "Admin users can read vendor stats"
  ON vendor_stats
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

-- Insert initial admin user
INSERT INTO admin_users (id, email)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  'admin@bev.merch.food'
);

-- Insert initial vendor stats
INSERT INTO vendor_stats (
  total_vendors,
  active_vendors,
  pending_vendors,
  total_revenue,
  avg_order_value
) VALUES (
  125,
  98,
  27,
  156789.50,
  234.56
);
