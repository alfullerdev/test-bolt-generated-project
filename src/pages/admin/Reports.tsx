import React, { useState, useEffect } from 'react';
import { Download, FileText, Calendar, Filter, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Vendor {
  id: string;
  business_name: string;
}

interface SalesReport {
  vendor_id: string;
  business_name: string;
  total_sales: number;
  total_orders: number;
  average_order_value: number;
  period: string;
}

function Reports() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<string>('all');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [customStartDate, setCustomStartDate] = useState<string>('');
  const [customEndDate, setCustomEndDate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [salesData, setSalesData] = useState<SalesReport[]>([]);

  useEffect(() => {
    fetchVendors();
    fetchSalesData();
  }, []);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('id, business_name')
        .order('business_name');

      if (error) throw error;
      setVendors(data || []);
    } catch (error) {
      console.error('Error fetching vendors:', error);
    }
  };

  const fetchSalesData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('sales_reports')
        .select(`
          vendor_id,
          business_name,
          total_sales,
          total_orders,
          average_order_value,
          period
        `);

      // Add vendor filter
      if (selectedVendor !== 'all') {
        query = query.eq('vendor_id', selectedVendor);
      }

      // Add date range filter
      const now = new Date();
      let startDate = new Date();
      
      switch (dateRange) {
        case '7d':
          startDate.setDate(now.getDate() - 7);
          query = query.gte('created_at', startDate.toISOString());
          break;
        case '30d':
          startDate.setDate(now.getDate() - 30);
          query = query.gte('created_at', startDate.toISOString());
          break;
        case '90d':
          startDate.setDate(now.getDate() - 90);
          query = query.gte('created_at', startDate.toISOString());
          break;
        case 'custom':
          if (customStartDate && customEndDate) {
            query = query
              .gte('created_at', customStartDate)
              .lte('created_at', customEndDate);
          }
          break;
      }

      const { data, error } = await query;

      if (error) throw error;
      setSalesData(data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to fetch sales data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    // Create CSV content
    const headers = ['Business Name', 'Total Sales', 'Total Orders', 'Average Order Value', 'Period'];
    const rows = salesData.map(report => [
      report.business_name,
      report.total_sales.toFixed(2),
      report.total_orders,
      report.average_order_value.toFixed(2),
      report.period
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Sales Reports</h1>
        <p className="text-gray-600">
          Generate and download sales reports by vendor and date range
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Vendor Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vendor
            </label>
            <select
              value={selectedVendor}
              onChange={(e) => setSelectedVendor(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="all">All Vendors</option>
              {vendors.map((vendor) => (
                <option key={vendor.id} value={vendor.id}>
                  {vendor.business_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as '7d' | '30d' | '90d' | 'custom')}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          {/* Custom Date Range */}
          {dateRange === 'custom' && (
            <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => fetchSalesData()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center"
          >
            <Filter className="h-5 w-5 mr-2" />
            Apply Filters
          </button>
          <button
            onClick={handleDownload}
            disabled={salesData.length === 0}
            className="gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </button>
        </div>
      </div>

      {/* Sales Data Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <Loader className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
            <p className="text-gray-600">Loading sales data...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">{error}</p>
          </div>
        ) : salesData.length === 0 ? (
          <div className="p-8 text-center">
            <FileText className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No sales data available for the selected filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Business Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Average Order Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Period
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesData.map((report, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">
                        {report.business_name}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      ${report.total_sales.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      {report.total_orders}
                    </td>
                    <td className="px-6 py-4">
                      ${report.average_order_value.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                        {report.period}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
