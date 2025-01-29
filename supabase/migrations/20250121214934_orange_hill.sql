-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public to create vendors" ON vendors;
DROP POLICY IF EXISTS "Vendors can read own data" ON vendors;
DROP POLICY IF EXISTS "Vendors can update own records" ON vendors;

-- Allow public insertion with event validation
CREATE POLICY "Allow public to create vendors"
  ON vendors
  FOR INSERT
  TO public
  WITH CHECK (
    -- Ensure event_id exists and is upcoming
    event_id IN (SELECT id FROM events WHERE status = 'upcoming')
  );

-- Allow vendors to read their own data
CREATE POLICY "Vendors can read own data"
  ON vendors
  FOR SELECT
  TO authenticated
  USING (
    -- Allow vendors to read their own data or admins to read all
    id = auth.uid() OR 
    EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid())
  );

-- Allow vendors to update their own records
CREATE POLICY "Vendors can update own records"
  ON vendors
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Ensure events are readable for validation
DROP POLICY IF EXISTS "Events are publicly readable" ON events;
CREATE POLICY "Events are publicly readable"
  ON events
  FOR SELECT
  TO public
  USING (true);
