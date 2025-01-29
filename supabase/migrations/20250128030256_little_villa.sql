-- Create sales reports table
CREATE TABLE IF NOT EXISTS sales_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendors(id),
  business_name text NOT NULL,
  total_sales numeric(10,2) DEFAULT 0,
  total_orders integer DEFAULT 0,
  average_order_value numeric(10,2) DEFAULT 0,
  period text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE sales_reports ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin users can read sales reports"
  ON sales_reports
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

-- Insert sample data
INSERT INTO sales_reports (
  vendor_id,
  business_name,
  total_sales,
  total_orders,
  average_order_value,
  period
)
SELECT
  v.id,
  v.business_name,
  random() * 10000 + 1000,
  floor(random() * 100 + 20),
  random() * 100 + 20,
  'Last 30 Days'
FROM vendors v
WHERE v.status = 'approved'
ON CONFLICT DO NOTHING;

-- Create function to generate sales report
CREATE OR REPLACE FUNCTION generate_sales_report(
  p_vendor_id uuid,
  p_start_date timestamptz,
  p_end_date timestamptz
)
RETURNS TABLE (
  vendor_id uuid,
  business_name text,
  total_sales numeric,
  total_orders integer,
  average_order_value numeric,
  period text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.business_name,
    COALESCE(SUM(sr.total_sales), 0)::numeric(10,2),
    COALESCE(SUM(sr.total_orders), 0)::integer,
    CASE
      WHEN SUM(sr.total_orders) > 0 THEN
        (SUM(sr.total_sales) / SUM(sr.total_orders))::numeric(10,2)
      ELSE 0
    END,
    to_char(p_start_date, 'Mon DD, YYYY') || ' - ' || to_char(p_end_date, 'Mon DD, YYYY')
  FROM vendors v
  LEFT JOIN sales_reports sr ON v.id = sr.vendor_id
  WHERE (p_vendor_id IS NULL OR v.id = p_vendor_id)
    AND (sr.created_at IS NULL OR sr.created_at BETWEEN p_start_date AND p_end_date)
  GROUP BY v.id, v.business_name;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION generate_sales_report(uuid, timestamptz, timestamptz) TO authenticated;
