import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, ShoppingBag, TrendingUp, Loader, AlertCircle } from 'lucide-react';
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

function Dashboard() {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [chartData, setChartData] = useState<DailyAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    try {
      // Fetch summary data for the last 30 days
      const { data: summaryData, error: summaryError } = await supabase
        .rpc('get_analytics_summary', { p_days: 30 });

      if (summaryError) throw summaryError;
      
      if (summaryData && summaryData.length > 0) {
        setSummary(summaryData[0]);
      }

      // Fetch chart data
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('analytics_daily')
        .select('date, total_orders, total_revenue')
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

  useEffect(() => {
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
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<ShoppingBag className="h-6 w-6 text-primary" />}
          label="Total Orders"
          value={summary?.total_orders || 0}
          trend={summary?.growth_percentage || 0}
        />
        <StatCard
          icon={<DollarSign className="h-6 w-6 text-green-600" />}
          label="Total Revenue"
          value={summary?.total_revenue || 0}
          prefix="$"
          trend={summary?.growth_percentage || 0}
        />
        <StatCard
          icon={<Users className="h-6 w-6 text-blue-600" />}
          label="Active Vendors"
          value={summary?.active_vendors || 0}
          trend={((summary?.active_vendors || 0) - (summary?.total_vendors || 0)) / (summary?.total_vendors || 1) * 100}
        />
        <StatCard
          icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
          label="Avg Order Value"
          value={summary?.avg_order_value || 0}
          prefix="$"
          trend={summary?.growth_percentage || 0}
        />
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Revenue Trend</h2>
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm text-gray-500">Last 30 days</span>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
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
              <Bar dataKey="total_revenue" fill="#FF512F" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">New Vendors</h2>
          <div className="text-center py-8">
            <div className="text-4xl font-bold gradient-text mb-2">
              +{summary?.new_vendors || 0}
            </div>
            <p className="text-gray-600">new vendors this month</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-4">Vendor Engagement</h2>
          <div className="text-center py-8">
            <div className="text-4xl font-bold gradient-text mb-2">
              {Math.round((summary?.active_vendors || 0) / (summary?.total_vendors || 1) * 100)}%
            </div>
            <p className="text-gray-600">vendor activity rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
