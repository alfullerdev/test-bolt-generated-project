import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Loader } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AnalyticsSummary {
  total_orders: number;
  total_revenue: number;
  total_vendors: number;
  active_vendors: number;
  new_vendors: number;
  avg_order_value: number;
  growth_percentage: number;
}

interface DailyAnalytics {
  date: string;
  total_orders: number;
  total_revenue: number;
  total_vendors: number;
  active_vendors: number;
}

function StatCard({ icon, label, value, trend, prefix = '' }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <h3 className="text-2xl font-bold mt-2">{prefix}{value.toLocaleString()}</h3>
        </div>
        <div className={`p-3 rounded-lg ${trend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
          {trend > 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last period</span>
      </div>
    </div>
  );
}

function Analytics() {
  const [summary, setSummary] = React.useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = React.useState<DailyAnalytics[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        // Fetch summary data
        const { data: summaryData, error: summaryError } = await supabase
          .rpc('get_analytics_summary', { p_days: 30 });

        if (summaryError) throw summaryError;
        if (summaryData && summaryData.length > 0) {
          setSummary(summaryData[0]);
        }

        // Fetch chart data
        const { data: analyticsData, error: analyticsError } = await supabase
          .from('analytics_daily')
          .select('*')
          .order('date', { ascending: true })
          .limit(30);

        if (analyticsError) throw analyticsError;
        setChartData(analyticsData || []);
      } catch (err) {
        console.error('Error fetching analytics:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600">Track your platform's performance metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          label="Total Revenue"
          value={summary?.total_revenue || 0}
          trend={summary?.growth_percentage || 0}
          prefix="$"
        />
        <StatCard
          icon={<Calendar className="h-6 w-6 text-blue-600" />}
          label="Total Orders"
          value={summary?.total_orders || 0}
          trend={summary?.growth_percentage || 0}
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-purple-600" />}
          label="Active Vendors"
          value={summary?.active_vendors || 0}
          trend={((summary?.active_vendors || 0) - (summary?.total_vendors || 0)) / (summary?.total_vendors || 1) * 100}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-primary" />}
          label="Avg Order Value"
          value={summary?.avg_order_value || 0}
          trend={summary?.growth_percentage || 0}
          prefix="$"
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-6">Revenue Trend</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis />
              <Tooltip
                formatter={(value: number) => ['$' + value.toLocaleString(), 'Revenue']}
                labelFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              />
              <Line
                type="monotone"
                dataKey="total_revenue"
                stroke="#FF512F"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
