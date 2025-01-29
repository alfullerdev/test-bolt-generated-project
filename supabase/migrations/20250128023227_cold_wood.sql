/*
  # Fix Event Reference for Vendors
  
  1. Changes
    - Ensure Hawaii Fest event exists
    - Update any vendors with missing event references
  
  2. Security
    - Maintains existing RLS policies
*/

-- Ensure Hawaii Fest event exists
INSERT INTO events (
  id,
  name,
  start_date,
  end_date,
  status,
  location
)
VALUES (
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

-- Update any vendors with missing event references
UPDATE vendors
SET event_id = '00000000-0000-0000-0000-000000000000'
WHERE event_id IS NULL;
