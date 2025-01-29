/*
  # Add Email Verification Table

  1. New Tables
    - `email_verifications`
      - `id` (uuid, primary key)
      - `email` (text, not null)
      - `code` (text, not null)
      - `expires_at` (timestamptz, not null)
      - `created_at` (timestamptz, default now())

  2. Security
    - Enable RLS on `email_verifications` table
    - Add policy for public access (needed for verification)
*/

-- Create email verifications table
CREATE TABLE IF NOT EXISTS email_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  code text NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE email_verifications ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Anyone can verify email"
  ON email_verifications
  FOR ALL
  TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS email_verifications_email_idx ON email_verifications(email);

-- Create cleanup function that can be called manually
CREATE OR REPLACE FUNCTION cleanup_expired_verifications()
RETURNS void AS $$
BEGIN
  DELETE FROM email_verifications
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;
