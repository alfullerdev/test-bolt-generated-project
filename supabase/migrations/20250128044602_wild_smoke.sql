-- Remove any duplicate Hawaii Fest events
DELETE FROM events 
WHERE name = 'Hawaii Fest' 
AND id != '00000000-0000-0000-0000-000000000000';

-- Ensure the Hawaii Fest event exists with the correct ID
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

-- Add unique constraint on event name to prevent duplicates
ALTER TABLE events ADD CONSTRAINT events_name_key UNIQUE (name);
