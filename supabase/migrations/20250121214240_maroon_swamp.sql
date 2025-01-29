/*
  # Update vendor RLS policies

  1. Changes
    - Update vendor creation policy to handle event ID reference
    - Add policy for event reference validation
    - Ensure proper data integrity

  2. Security
    - Maintain public access for vendor creation
    - Add validation for event references
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Allow public to create vendors" ON vendors;

-- Create updated policy with event validation
CREATE POLICY "Allow public to create vendors"
  ON vendors
  FOR INSERT
  TO public
  WITH CHECK (
    -- Ensure event_id exists in events table
    event_id IN (SELECT id FROM events WHERE status = 'upcoming')
  );

-- Add policy to allow reading events for validation
CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO public
  USING (true);
