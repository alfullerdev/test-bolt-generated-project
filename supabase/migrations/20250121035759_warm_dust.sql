/*
  # Create events table for vendor applications

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `name` (text, event name)
      - `start_date` (timestamptz, when event starts)
      - `end_date` (timestamptz, when event ends)
      - `status` (text, event status)
      - `total_vendors_applied` (integer, count of applications)
      - `total_vendors_accepted` (integer, count of accepted vendors)
      - `created_at` (timestamptz, when record was created)

  2. Security
    - Enable RLS on `events` table
    - Add policies for reading events
*/

CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  status text NOT NULL DEFAULT 'upcoming',
  total_vendors_applied integer NOT NULL DEFAULT 0,
  total_vendors_accepted integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT status_check CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled'))
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read events
CREATE POLICY "Events are viewable by everyone"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Insert initial event
INSERT INTO events (name, start_date, end_date, status)
VALUES (
  'Summer Food Festival 2024',
  '2024-07-01 10:00:00+00',
  '2024-07-03 20:00:00+00',
  'upcoming'
);
