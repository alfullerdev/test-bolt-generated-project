-- Update all existing vendors to have the new entry type
UPDATE vendors
SET entry_type = 'vendor updated on site'
WHERE entry_type = 'signup';

-- Add comment explaining the entry type values
COMMENT ON COLUMN vendors.entry_type IS 'How the vendor record was created/updated: manual, vendor updated on site';
