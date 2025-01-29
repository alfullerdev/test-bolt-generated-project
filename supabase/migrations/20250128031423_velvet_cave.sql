-- Drop existing function
DROP FUNCTION IF EXISTS get_analytics_summary(integer);

-- Create improved analytics summary function with proper column references
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
  IF p_days <= 0 THEN
    RAISE EXCEPTION 'Days parameter must be positive';
  END IF;

  RETURN QUERY
  WITH current_period AS (
    SELECT
      COALESCE(SUM(NULLIF(analytics_daily.total_orders, 0))::numeric, 0) as period_orders,
      COALESCE(SUM(NULLIF(analytics_daily.total_revenue, 0))::numeric, 0) as period_revenue,
      COALESCE(AVG(NULLIF(analytics_daily.total_vendors, 0))::numeric, 0) as period_vendors,
      COALESCE(AVG(NULLIF(analytics_daily.active_vendors, 0))::numeric, 0) as period_active_vendors,
      COALESCE(SUM(NULLIF(analytics_daily.new_vendors, 0))::numeric, 0) as period_new_vendors,
      CASE 
        WHEN SUM(NULLIF(analytics_daily.total_orders, 0)) > 0 THEN 
          (SUM(NULLIF(analytics_daily.total_revenue, 0)) / SUM(NULLIF(analytics_daily.total_orders, 0)))::numeric
        ELSE 0 
      END as period_avg_order
    FROM analytics_daily
    WHERE analytics_daily.date > current_date - (p_days || ' days')::interval
  ),
  previous_period AS (
    SELECT
      COALESCE(SUM(NULLIF(analytics_daily.total_revenue, 0))::numeric, 0) as prev_revenue
    FROM analytics_daily
    WHERE analytics_daily.date > current_date - (p_days * 2 || ' days')::interval
      AND analytics_daily.date <= current_date - (p_days || ' days')::interval
  )
  SELECT
    ROUND(cp.period_orders::numeric, 2) as total_orders,
    ROUND(cp.period_revenue::numeric, 2) as total_revenue,
    ROUND(cp.period_vendors::numeric, 2) as total_vendors,
    ROUND(cp.period_active_vendors::numeric, 2) as active_vendors,
    ROUND(cp.period_new_vendors::numeric, 2) as new_vendors,
    ROUND(cp.period_avg_order::numeric, 2) as avg_order_value,
    CASE
      WHEN NULLIF(pp.prev_revenue, 0) IS NOT NULL THEN
        ROUND(((cp.period_revenue - pp.prev_revenue) / pp.prev_revenue * 100)::numeric, 1)
      ELSE 0
    END as growth_percentage
  FROM current_period cp
  CROSS JOIN previous_period pp;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_analytics_summary(integer) TO authenticated;
