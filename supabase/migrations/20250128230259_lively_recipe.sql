-- First modify the check constraint to allow the new value
ALTER TABLE vendors
DROP CONSTRAINT IF EXISTS vendors_entry_type_check;

ALTER TABLE vendors
ADD CONSTRAINT vendors_entry_type_check 
CHECK (entry_type IN ('manual', 'signup', 'vendor updated on site'));

-- Now update the values
UPDATE vendors
SET entry_type = 'vendor updated on site'
WHERE entry_type = 'signup';

-- Add comment explaining the entry type values
COMMENT ON COLUMN vendors.entry_type IS 'How the vendor record was created/updated: manual, vendor updated on site';
