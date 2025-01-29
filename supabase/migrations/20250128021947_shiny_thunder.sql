/*
  # Add Vendor Fields

  1. Changes
    - Add dietary_options column to vendors table
    - Add entry_type column to vendors table
    - Add payment_received column to vendors table
    - Add get_license_number column to vendors table

  2. Security
    - Maintain existing RLS policies
*/

-- Add new columns if they don't exist
DO $$ 
BEGIN
  -- Add dietary_options column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' AND column_name = 'dietary_options'
  ) THEN
    ALTER TABLE vendors ADD COLUMN dietary_options text[] DEFAULT '{}';
  END IF;

  -- Add entry_type column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' AND column_name = 'entry_type'
  ) THEN
    ALTER TABLE vendors ADD COLUMN entry_type text DEFAULT 'signup' CHECK (entry_type IN ('manual', 'signup'));
  END IF;

  -- Add payment_received column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' AND column_name = 'payment_received'
  ) THEN
    ALTER TABLE vendors ADD COLUMN payment_received boolean DEFAULT false;
  END IF;

  -- Add get_license_number column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'vendors' AND column_name = 'get_license_number'
  ) THEN
    ALTER TABLE vendors ADD COLUMN get_license_number text;
  END IF;
END $$;
