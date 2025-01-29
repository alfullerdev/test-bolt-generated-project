/*
  # Update Events for Hawaii Fest

  1. Changes
    - Remove existing events
    - Add Hawaii Fest 2025 event
    - Add location column to events table

  2. Security
    - Maintains existing RLS policies
*/

-- Add location column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'events' AND column_name = 'location'
  ) THEN
    ALTER TABLE events ADD COLUMN location text;
  END IF;
END $$;

-- Clear existing events
TRUNCATE TABLE events;

-- Insert Hawaii Fest event
INSERT INTO events (
  name,
  start_date,
  end_date,
  status,
  location
) VALUES (
  'Hawaii Fest',
  '2025-02-15 00:00:00+00',
  '2025-02-16 00:00:00+00',
  'upcoming',
  'Monaluana Gardens'
);
