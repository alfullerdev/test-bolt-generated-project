import React, { useState } from 'react';
import { X, Loader, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import BasicInfo from '../VendorSignup/steps/BasicInfo';
import BusinessDetails from '../VendorSignup/steps/BusinessDetails';
import MenuDetails from '../VendorSignup/steps/MenuDetails';
import MenuItems from '../VendorSignup/steps/MenuItems';
import Documents from '../VendorSignup/steps/Documents';
import { SignupFormData } from '../VendorSignup/VendorSignupForm';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

function ManualVendorModal({ onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    businessType: '',
    getLicenseNumber: '',
    website: '',
    description: '',
    cuisineTypes: [],
    dietaryOptions: [],
    priceRange: 50,
    servingCapacity: 100,
    menuItems: [],
    eventId: '00000000-0000-0000-0000-000000000000', // Hawaii Fest ID
    hasBusinessLicense: false,
    hasHealthPermit: false,
    hasInsurance: false,
    includeCanopy: false,
  });

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const validateForm = () => {
    if (!formData.email?.trim()) return 'Email is required';
    if (!formData.phone?.trim()) return 'Phone number is required';
    if (!formData.firstName?.trim()) return 'First name is required';
    if (!formData.lastName?.trim()) return 'Last name is required';
    if (!formData.businessName?.trim()) return 'Business name is required';
    if (!formData.businessType?.trim()) return 'Business type is required';
    if (!formData.getLicenseNumber?.trim()) return 'GET License Number is required';
    if (!formData.description?.trim()) return 'Business description is required';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert form data to snake_case for database
      const vendorData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.businessName,
        business_type: formData.businessType,
        get_license_number: formData.getLicenseNumber,
        website: formData.website,
        description: formData.description,
        cuisine_types: formData.cuisineTypes,
        dietary_options: formData.dietaryOptions,
        price_range: formData.priceRange,
        serving_capacity: formData.servingCapacity,
        menu_items: formData.menuItems,
        event_id: formData.eventId,
        entry_type: 'manual',
        status: 'pending_approval', 
        payment_intent_id: 'manual_entry', 
        payment_received: false
      };

      const { error: insertError } = await supabase
        .from('vendors')
        .insert([vendorData]);

      if (insertError) throw insertError;

      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add vendor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white z-10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Add Vendor Manually</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
              <span>{error}</span>
            </div>
          )}

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
        </div>

        <div className="p-6 border-t sticky bottom-0 bg-white">
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="gradient-bg text-white px-6 py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center"
            >
              {isLoading ? (
                <>
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Saving...
                </>
              ) : (
                'Save Vendor'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManualVendorModal;
