import React, { useState, useEffect } from 'react';
import { Package, Clock, MapPin, CreditCard, Plus, Minus, Trash2, Eye, X, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import ManualVendorModal from '../../components/admin/ManualVendorModal';
import BasicInfo from '../../components/VendorSignup/steps/BasicInfo';
import BusinessDetails from '../../components/VendorSignup/steps/BusinessDetails';
import MenuDetails from '../../components/VendorSignup/steps/MenuDetails';
import MenuItems from '../../components/VendorSignup/steps/MenuItems';
import Documents from '../../components/VendorSignup/steps/Documents';
import { SignupFormData } from '../../components/VendorSignup/VendorSignupForm';

interface Vendor {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  business_name: string;
  business_type: string;
  get_license_number: string;
  website: string;
  description: string;
  dietary_options: string[];
  status: string;
  created_at: string;
  entry_type: 'manual' | 'signup';
  payment_received: boolean;
  menu_items: any[];
  cuisine_types: string[];
  price_range: number;
  serving_capacity: number;
}

interface ViewEditModalProps {
  vendor: Vendor;
  onClose: () => void;
  onSave: (updatedVendor: Vendor) => Promise<void>;
}

function ViewEditModal({ vendor, onClose, onSave }: ViewEditModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prevent body scroll when modal is open
  React.useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const [formData, setFormData] = useState<SignupFormData>({
    firstName: vendor.first_name,
    lastName: vendor.last_name,
    email: vendor.email,
    phone: vendor.phone,
    businessName: vendor.business_name,
    businessType: vendor.business_type,
    getLicenseNumber: vendor.get_license_number,
    website: vendor.website || '',
    description: vendor.description || '',
    cuisineTypes: vendor.cuisine_types || [],
    dietaryOptions: vendor.dietary_options || [],
    priceRange: vendor.price_range || 50,
    servingCapacity: vendor.serving_capacity || 100,
    menuItems: vendor.menu_items || [],
    eventId: '00000000-0000-0000-0000-000000000000',
    hasBusinessLicense: true,
    hasHealthPermit: true,
    hasInsurance: true,
    includeCanopy: false
  });

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Convert form data to vendor format
      const updatedVendor: Vendor = {
        ...vendor,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email || '',
        phone: formData.phone,
        business_name: formData.businessName,
        business_type: formData.businessType,
        get_license_number: formData.getLicenseNumber,
        website: formData.website,
        description: formData.description || '',
        cuisine_types: formData.cuisineTypes,
        dietary_options: formData.dietaryOptions,
        price_range: formData.priceRange,
        serving_capacity: formData.servingCapacity,
        menu_items: formData.menuItems
      };

      await onSave(updatedVendor);
      setEditMode(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update vendor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-hidden">
      <div className="bg-white rounded-xl max-w-4xl w-full h-[90vh] flex flex-col">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">
              {editMode ? 'Edit Vendor' : 'Vendor Details'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-8">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
                <span>{error}</span>
              </div>
            )}

            {editMode ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <h3 className="font-semibold mb-4">Basic Information</h3>
                  <BasicInfo formData={formData} updateFormData={updateFormData} />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Business Details</h3>
                  <BusinessDetails formData={formData} updateFormData={updateFormData} />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Menu Details</h3>
                  <MenuDetails formData={formData} updateFormData={updateFormData} />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Menu Items</h3>
                  <MenuItems formData={formData} updateFormData={updateFormData} />
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Required Documents</h3>
                  <Documents formData={formData} updateFormData={updateFormData} />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="gradient-bg text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="animate-spin h-5 w-5 mr-2" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div>
                  <h3 className="font-semibold mb-4">Basic Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p>{vendor.first_name} {vendor.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p>{vendor.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p>{vendor.phone}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Business Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Business Name</p>
                      <p>{vendor.business_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Business Type</p>
                      <p>{vendor.business_type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">GET License Number</p>
                      <p>{vendor.get_license_number}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <p>{vendor.website || 'Not provided'}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Description</p>
                    <p>{vendor.description || 'Not provided'}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Menu Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Dietary Options</p>
                      <p>{vendor.dietary_options?.join(', ') || 'None'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cuisine Types</p>
                      <p>{vendor.cuisine_types?.join(', ') || 'None'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Menu Items</h3>
                  {vendor.menu_items?.length > 0 ? (
                    <div className="space-y-2">
                      {vendor.menu_items.map((item, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-gray-600">{item.description}</p>
                          <p className="text-primary">${item.price}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No menu items added</p>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => setEditMode(true)}
                    className="gradient-bg text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Edit Vendor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Vendors() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [stats, setStats] = useState<{
    total: number;
    manual: number;
    signup: number;
    pending_payment: number;
  }>({
    total: 0,
    manual: 0,
    signup: 0,
    pending_payment: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<Vendor | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  const fetchVendors = async () => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setVendors(data || []);

      // Calculate stats
      const total = data?.length || 0;
      const manual = data?.filter(v => v.entry_type === 'manual').length || 0;
      const signup = data?.filter(v => v.entry_type === 'signup').length || 0;
      const pendingPayment = data?.filter(v => !v.payment_received).length || 0;

      setStats({ total, manual, signup, pending_payment: pendingPayment });
    } catch (error) {
      console.error('Error fetching vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleDelete = async (vendor: Vendor) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', vendor.id);

      if (error) throw error;
      fetchVendors();
    } catch (error) {
      console.error('Error deleting vendor:', error);
    } finally {
      setVendorToDelete(null);
    }
  };

  const handleManualVendorSuccess = () => {
    fetchVendors();
    setShowManualModal(false);
  };

  const handleUpdateVendor = async (updatedVendor: Vendor) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .update(updatedVendor)
        .eq('id', updatedVendor.id);

      if (error) throw error;
      fetchVendors();
      setSelectedVendor(null);
    } catch (error) {
      throw error;
    }
  };

  const filteredVendors = vendors.filter(vendor => 
    vendor.business_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${vendor.first_name} ${vendor.last_name}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Total Vendors</h3>
          <p className="text-2xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Manual Entries</h3>
          <p className="text-2xl font-bold mt-2">{stats.manual}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Self Sign-ups</h3>
          <p className="text-2xl font-bold mt-2">{stats.signup}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h3 className="text-gray-500 text-sm">Pending Payment</h3>
          <p className="text-2xl font-bold mt-2">{stats.pending_payment}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          <button
            onClick={() => setShowManualModal(true)}
            className="gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90 transition flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Vendor Manually
          </button>
        </div>
      </div>

      {/* Vendors List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Entry Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <Loader className="animate-spin h-5 w-5 mx-auto text-primary" />
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No vendors found
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{vendor.business_name}</div>
                      <div className="text-sm text-gray-500">GET #{vendor.get_license_number}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {vendor.first_name} {vendor.last_name}
                      </div>
                      <div className="text-sm text-gray-500">{vendor.email}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {vendor.business_type}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.entry_type === 'manual'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {vendor.entry_type === 'manual' ? 'Manual' : 'Sign-up'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : vendor.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.payment_received
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {vendor.payment_received ? 'Received' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => setSelectedVendor(vendor)}
                          className="text-primary hover:text-secondary transition"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setVendorToDelete(vendor)}
                          className="text-red-600 hover:text-red-800 transition"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {vendorToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete vendor "{vendorToDelete.business_name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setVendorToDelete(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(vendorToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View/Edit Vendor Modal */}
      {selectedVendor && (
        <ViewEditModal
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onSave={handleUpdateVendor}
        />
      )}

      {/* Manual Vendor Modal */}
      {showManualModal && (
        <ManualVendorModal
          onClose={() => setShowManualModal(false)}
          onSuccess={handleManualVendorSuccess}
        />
      )}
    </div>
  );
}

export default Vendors;
