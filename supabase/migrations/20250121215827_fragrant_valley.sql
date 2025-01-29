-- Drop existing policies
DROP POLICY IF EXISTS "Allow public to create vendors" ON vendors;
DROP POLICY IF EXISTS "Vendors can read own data" ON vendors;
DROP POLICY IF EXISTS "Vendors can update own records" ON vendors;

-- Allow anyone to create vendors (needed for signup)
CREATE POLICY "Anyone can create vendors"
  ON vendors
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow vendors to read their own data and admins to read all
CREATE POLICY "Vendor data access"
  ON vendors
  FOR SELECT
  TO public
  USING (
    auth.uid()::text = id::text OR 
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Allow vendors to update their own data
CREATE POLICY "Vendors can update own data"
  ON vendors
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- Ensure events are readable
DROP POLICY IF EXISTS "Events are publicly readable" ON events;
CREATE POLICY "Events are publicly readable"
  ON events
  FOR SELECT
  TO public
  USING (true);
