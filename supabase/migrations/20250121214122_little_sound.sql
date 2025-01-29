/*
  # Add vendor creation policy

  1. Changes
    - Add RLS policy to allow vendor creation
    - Allow unauthenticated users to create vendor records
    - Ensure data integrity with proper constraints

  2. Security
    - Enable public access for vendor creation
    - Maintain existing RLS policies
*/

-- Add policy to allow vendor creation
CREATE POLICY "Allow public to create vendors"
  ON vendors
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Add policy to allow vendors to update their own records
CREATE POLICY "Vendors can update own records"
  ON vendors
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);
