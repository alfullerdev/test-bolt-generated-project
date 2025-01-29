/*
  # Update Vendor Schema
  
  1. Changes
    - Make dietary_options NOT NULL with default empty array
    - Make get_license_number NOT NULL
    - Make entry_type and payment_received NOT NULL
    - Remove cuisine_types NOT NULL constraint and set default
    - Add default values for price_range and serving_capacity
    - Update existing records with default values
  
  2. Security
    - Maintains existing RLS policies
*/

-- First update existing records to ensure no NULL values
UPDATE vendors 
SET 
  dietary_options = COALESCE(dietary_options, '{}'),
  cuisine_types = COALESCE(cuisine_types, '{}'),
  price_range = COALESCE(price_range, 0),
  serving_capacity = COALESCE(serving_capacity, 0),
  payment_received = COALESCE(payment_received, false),
  entry_type = COALESCE(entry_type, 'signup');

-- Now make columns NOT NULL and set defaults
ALTER TABLE vendors 
  ALTER COLUMN dietary_options SET NOT NULL,
  ALTER COLUMN dietary_options SET DEFAULT '{}',
  ALTER COLUMN get_license_number SET NOT NULL,
  ALTER COLUMN entry_type SET NOT NULL,
  ALTER COLUMN payment_received SET NOT NULL;

-- Remove NOT NULL constraint from cuisine_types and set default
ALTER TABLE vendors 
  ALTER COLUMN cuisine_types DROP NOT NULL,
  ALTER COLUMN cuisine_types SET DEFAULT '{}';

-- Set defaults for numeric columns
ALTER TABLE vendors 
  ALTER COLUMN price_range SET DEFAULT 0,
  ALTER COLUMN serving_capacity SET DEFAULT 0;

-- Add comment explaining table structure
COMMENT ON TABLE vendors IS 'Stores vendor information with proper defaults and constraints';
