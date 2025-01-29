-- Ensure proper schema setup
DO $$
BEGIN
  -- Ensure events table has proper structure
  ALTER TABLE events ALTER COLUMN name SET NOT NULL;
  ALTER TABLE events ALTER COLUMN start_date SET NOT NULL;
  ALTER TABLE events ALTER COLUMN end_date SET NOT NULL;
  ALTER TABLE events ALTER COLUMN status SET NOT NULL;
  ALTER TABLE events ALTER COLUMN status SET DEFAULT 'upcoming';
  ALTER TABLE events ALTER COLUMN location SET NOT NULL;

  -- Ensure vendors table has proper structure
  ALTER TABLE vendors ALTER COLUMN first_name SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN last_name SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN email SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN phone SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN business_name SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN business_type SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN get_license_number SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN description SET NOT NULL;
  ALTER TABLE vendors ALTER COLUMN dietary_options SET DEFAULT '{}';
  ALTER TABLE vendors ALTER COLUMN cuisine_types SET DEFAULT '{}';
  ALTER TABLE vendors ALTER COLUMN price_range SET DEFAULT 0;
  ALTER TABLE vendors ALTER COLUMN serving_capacity SET DEFAULT 0;
  ALTER TABLE vendors ALTER COLUMN menu_items SET DEFAULT '[]';
  ALTER TABLE vendors ALTER COLUMN entry_type SET DEFAULT 'signup';
  ALTER TABLE vendors ALTER COLUMN payment_received SET DEFAULT false;

  -- Ensure proper indexes exist
  CREATE INDEX IF NOT EXISTS idx_vendors_email ON vendors(email);
  CREATE INDEX IF NOT EXISTS idx_vendors_business_name ON vendors(business_name);
  CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);
  CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);

  -- Ensure proper RLS policies
  ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
  ALTER TABLE events ENABLE ROW LEVEL SECURITY;

  -- Create policy for public read access to events
  DROP POLICY IF EXISTS "Public read access" ON events;
  CREATE POLICY "Public read access" ON events
    FOR SELECT
    TO public
    USING (true);

  -- Create policy for public read access to vendors
  DROP POLICY IF EXISTS "Public read access" ON vendors;
  CREATE POLICY "Public read access" ON vendors
    FOR SELECT
    TO public
    USING (true);

  -- Create policy for authenticated users to create vendors
  DROP POLICY IF EXISTS "Authenticated users can create vendors" ON vendors;
  CREATE POLICY "Authenticated users can create vendors" ON vendors
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

  -- Create policy for authenticated users to update their own vendor records
  DROP POLICY IF EXISTS "Authenticated users can update own vendor records" ON vendors;
  CREATE POLICY "Authenticated users can update own vendor records" ON vendors
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text)
    WITH CHECK (auth.uid()::text = id::text);

  -- Ensure Hawaii Fest event exists
  INSERT INTO events (
    id,
    name,
    start_date,
    end_date,
    status,
    location
  ) VALUES (
    '00000000-0000-0000-0000-000000000000',
    'Hawaii Fest',
    '2025-02-15 00:00:00+00',
    '2025-02-16 00:00:00+00',
    'upcoming',
    'Moanalua Gardens'
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    name = EXCLUDED.name,
    start_date = EXCLUDED.start_date,
    end_date = EXCLUDED.end_date,
    status = EXCLUDED.status,
    location = EXCLUDED.location;

  -- Grant necessary permissions
  GRANT USAGE ON SCHEMA auth TO anon, authenticated;
  GRANT SELECT ON auth.users TO anon, authenticated;
END $$;
