-- Add discount column to vendors table
ALTER TABLE vendors ADD COLUMN IF NOT EXISTS discount numeric(10,2) DEFAULT 0;

-- Add comment explaining the column
COMMENT ON COLUMN vendors.discount IS 'Amount to be discounted from vendor registration fee';
