/*
  # Create vendors table and related schemas

  1. New Tables
    - `vendors`
      - `id` (uuid, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `business_name` (text)
      - `business_type` (text)
      - `website` (text)
      - `description` (text)
      - `cuisine_types` (text[])
      - `dietary_options` (text[])
      - `price_range` (integer)
      - `serving_capacity` (integer)
      - `menu_items` (jsonb)
      - `event_id` (uuid, references events)
      - `payment_intent_id` (text)
      - `status` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `vendors` table
    - Add policies for authenticated users to read their own data
*/

CREATE TABLE IF NOT EXISTS vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  business_name text NOT NULL,
  business_type text NOT NULL,
  website text,
  description text NOT NULL,
  cuisine_types text[] NOT NULL,
  dietary_options text[] NOT NULL,
  price_range integer NOT NULL,
  serving_capacity integer NOT NULL,
  menu_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  event_id uuid REFERENCES events(id) NOT NULL,
  payment_intent_id text NOT NULL,
  status text NOT NULL DEFAULT 'pending_approval',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('pending_approval', 'approved', 'rejected'))
);

-- Enable RLS
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Vendors can read own data"
  ON vendors
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at
CREATE TRIGGER update_vendors_updated_at
  BEFORE UPDATE ON vendors
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
