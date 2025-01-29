-- Create analytics tables
CREATE TABLE IF NOT EXISTS analytics_daily (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  total_orders integer DEFAULT 0,
  total_revenue numeric(10,2) DEFAULT 0,
  total_vendors integer DEFAULT 0,
  active_vendors integer DEFAULT 0,
  new_vendors integer DEFAULT 0,
  avg_order_value numeric(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE analytics_daily ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin users can read analytics"
  ON analytics_daily
  FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  ));

-- Insert sample data for the last 6 months
WITH RECURSIVE dates AS (
  SELECT current_date - interval '6 months' as date
  UNION ALL
  SELECT date + interval '1 day'
  FROM dates
  WHERE date < current_date
)
INSERT INTO analytics_daily (date, total_orders, total_revenue, total_vendors, active_vendors, new_vendors, avg_order_value)
SELECT
  date,
  -- Generate random data that increases over time
  floor(random() * (200 - 50 + 1) + 50 + (extract(epoch from date - (current_date - interval '6 months')) / 86400))::integer as total_orders,
  floor(random() * (10000 - 2000 + 1) + 2000 + (extract(epoch from date - (current_date - interval '6 months')) / 86400))::numeric(10,2) as total_revenue,
  floor(random() * (150 - 50 + 1) + 50 + (extract(epoch from date - (current_date - interval '6 months')) / 86400))::integer as total_vendors,
  floor(random() * (100 - 30 + 1) + 30 + (extract(epoch from date - (current_date - interval '6 months')) / 86400))::integer as active_vendors,
  floor(random() * 10)::integer as new_vendors,
  floor(random() * (100 - 20 + 1) + 20)::numeric(10,2) as avg_order_value
FROM dates
WHERE date <= current_date;

-- Create function to get analytics summary
CREATE OR REPLACE FUNCTION get_analytics_summary(p_days integer)
RETURNS TABLE (
  total_orders integer,
  total_revenue numeric,
  total_vendors integer,
  active_vendors integer,
  new_vendors integer,
  avg_order_value numeric,
  growth_percentage numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  WITH current_period AS (
    SELECT
      sum(total_orders) as orders,
      sum(total_revenue) as revenue,
      avg(total_vendors) as vendors,
      avg(active_vendors) as active,
      sum(new_vendors) as new,
      avg(avg_order_value) as aov
    FROM analytics_daily
    WHERE date > current_date - (p_days || ' days')::interval
  ),
  previous_period AS (
    SELECT
      sum(total_revenue) as prev_revenue
    FROM analytics_daily
    WHERE date > current_date - (p_days * 2 || ' days')::interval
      AND date <= current_date - (p_days || ' days')::interval
  )
  SELECT
    orders::integer,
    revenue::numeric(10,2),
    vendors::integer,
    active::integer,
    new::integer,
    aov::numeric(10,2),
    CASE
      WHEN prev_revenue > 0 THEN
        round(((revenue - prev_revenue) / prev_revenue * 100)::numeric, 1)
      ELSE
        0
    END as growth
  FROM current_period, previous_period;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_analytics_summary(integer) TO authenticated;
