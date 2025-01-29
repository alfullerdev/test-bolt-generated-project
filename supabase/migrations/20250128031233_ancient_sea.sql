-- Drop existing function
DROP FUNCTION IF EXISTS get_analytics_summary(integer);

-- Create improved analytics summary function with proper data types
CREATE OR REPLACE FUNCTION get_analytics_summary(p_days integer)
RETURNS TABLE (
  total_orders numeric,
  total_revenue numeric,
  total_vendors numeric,
  active_vendors numeric,
  new_vendors numeric,
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
      COALESCE(SUM(ad.total_orders)::numeric, 0) as period_orders,
      COALESCE(SUM(ad.total_revenue)::numeric, 0) as period_revenue,
      COALESCE(AVG(ad.total_vendors)::numeric, 0) as period_vendors,
      COALESCE(AVG(ad.active_vendors)::numeric, 0) as period_active_vendors,
      COALESCE(SUM(ad.new_vendors)::numeric, 0) as period_new_vendors,
      CASE 
        WHEN SUM(ad.total_orders) > 0 THEN 
          COALESCE((SUM(ad.total_revenue) / SUM(ad.total_orders))::numeric, 0)
        ELSE 0 
      END as period_avg_order
    FROM analytics_daily ad
    WHERE ad.date > current_date - (p_days || ' days')::interval
  ),
  previous_period AS (
    SELECT
      COALESCE(SUM(ad.total_revenue)::numeric, 0) as prev_revenue
    FROM analytics_daily ad
    WHERE ad.date > current_date - (p_days * 2 || ' days')::interval
      AND ad.date <= current_date - (p_days || ' days')::interval
  )
  SELECT
    cp.period_orders::numeric as total_orders,
    cp.period_revenue::numeric(10,2) as total_revenue,
    cp.period_vendors::numeric as total_vendors,
    cp.period_active_vendors::numeric as active_vendors,
    cp.period_new_vendors::numeric as new_vendors,
    cp.period_avg_order::numeric(10,2) as avg_order_value,
    CASE
      WHEN pp.prev_revenue > 0 THEN
        round(((cp.period_revenue - pp.prev_revenue) / pp.prev_revenue * 100)::numeric, 1)
      ELSE 0
    END as growth_percentage
  FROM current_period cp
  CROSS JOIN previous_period pp;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_analytics_summary(integer) TO authenticated;
