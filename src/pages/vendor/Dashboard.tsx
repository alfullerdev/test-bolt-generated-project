import React, { useState, useEffect } from 'react';
import { ShoppingBag, DollarSign, Users, TrendingUp } from 'lucide-react';
import RecentOrders from '../../components/vendor/RecentOrders';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../components/AuthProvider';

interface VendorData {
  business_name: string;
  business_type: string;
  description: string;
  menu_items: any[];
  status: string;
  created_at: string;
}

function StatCard({ icon, label, value, trend }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 text-sm">{label}</p>
          <h3 className="text-2xl font-bold mt-2">{value}</h3>
        </div>
        <div className={`p-3 rounded-lg ${trend >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
          {icon}
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={trend >= 0 ? 'text-green-500' : 'text-red-500'}>
          {trend}%
        </span>
        <span className="text-gray-500 text-sm ml-2">vs last month</span>
      </div>
    </div>
  );
}

function VendorDashboard() {
  const { auth } = useAuth();
  const [vendorData, setVendorData] = useState<VendorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const { data, error } = await supabase
          .from('vendors')
          .select('*')
          .eq('email', auth?.user?.email)
          .single();

        if (error) throw error;
        setVendorData(data);
      } catch (err) {
        console.error('Error fetching vendor data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch vendor data');
      } finally {
        setIsLoading(false);
      }
    };

    if (auth?.user?.email) {
      fetchVendorData();
    }
  }, [auth?.user?.email]);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow-lg">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
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
      {vendorData && (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">{vendorData.business_name}</h1>
            <p className="text-gray-600">{vendorData.business_type}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<ShoppingBag className="h-6 w-6 text-primary" />}
              label="Total Orders"
              value="156"
              trend={12.5}
            />
            <StatCard
              icon={<DollarSign className="h-6 w-6 text-green-600" />}
              label="Revenue"
              value="$4,320"
              trend={8.2}
            />
            <StatCard
              icon={<Users className="h-6 w-6 text-blue-600" />}
              label="Menu Items"
              value={vendorData.menu_items?.length || 0}
              trend={5.1}
            />
            <StatCard
              icon={<TrendingUp className="h-6 w-6 text-purple-600" />}
              label="Avg Order Value"
              value="$27.65"
              trend={-2.3}
            />
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Business Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1">{vendorData.description || 'No description provided'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${
                  vendorData.status === 'approved' 
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {vendorData.status.charAt(0).toUpperCase() + vendorData.status.slice(1)}
                </span>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                <p className="mt-1">{new Date(vendorData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <RecentOrders />
        </>
      )}
    </div>
  );
}

export default VendorDashboard;
