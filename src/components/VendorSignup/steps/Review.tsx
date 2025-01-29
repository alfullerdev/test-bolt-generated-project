import React, { useState } from 'react';
import { SignupFormData } from '../VendorSignupForm';
import { Check, Edit2, Loader, CreditCard } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
  setCurrentStep: (step: number) => void;
}

function Review({ formData, setCurrentStep }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Format vendor data
      const vendorData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.businessName,
        business_type: formData.businessType,
        get_license_number: formData.getLicenseNumber,
        website: formData.website || '',
        description: formData.description || '',
        cuisine_types: formData.cuisineTypes || [],
        dietary_options: formData.dietaryOptions || [],
        price_range: formData.priceRange || 0,
        serving_capacity: formData.servingCapacity || 0,
        menu_items: formData.menuItems || [],
        event_id: '00000000-0000-0000-0000-000000000000', // Hawaii Fest ID
        payment_intent_id: 'manual_entry',
        status: 'pending_approval',
        entry_type: 'vendor updated on site',
        payment_received: true
      };

      // Check if vendor already exists
      const { data: existingVendor } = await supabase
        .from('vendors')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingVendor) {
        // Update existing vendor
        const { error: updateError } = await supabase
          .from('vendors')
          .update(vendorData)
          .eq('id', existingVendor.id);

        if (updateError) throw updateError;
      } else {
        // Insert new vendor
        const { error: insertError } = await supabase
          .from('vendors')
          .insert([vendorData]);

        if (insertError) throw insertError;
      }

      // Clear form data from localStorage
      localStorage.removeItem('vendorFormProgress');
      
      setSuccess(true);
    } catch (err) {
      console.error('Error saving vendor:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-8 w-8 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-4">Application Submitted Successfully!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for applying to be a vendor at Hawaii Fest. We'll review your application and get back to you soon.
        </p>
        <p className="text-gray-600">
          Please check your email for confirmation and next steps.
        </p>
      </div>
    );
  }

  // Calculate fees
  const baseVendorFee = formData.businessType === 'Food Truck' ? 2000 : 1500;
  const canopyFee = 1500;
  const totalFee = baseVendorFee + (formData.includeCanopy ? canopyFee : 0);

  const sections = [
    {
      title: 'Personal Information',
      step: 0,
      fields: [
        { label: 'First Name', value: formData.firstName },
        { label: 'Last Name', value: formData.lastName },
        { label: 'Email', value: formData.email },
        { label: 'Phone', value: formData.phone },
      ],
    },
    {
      title: 'Business Information',
      step: 1,
      fields: [
        { label: 'Business Name', value: formData.businessName },
        { label: 'Business Type', value: formData.businessType },
        { label: 'Website', value: formData.website || 'Not provided' },
        { label: 'Description', value: formData.description || 'Not provided' },
      ],
    },
    {
      title: 'Menu Details',
      step: 2,
      fields: [
        { label: 'Dietary Options', value: formData.dietaryOptions.join(', ') || 'None selected' },
      ],
    },
    {
      title: 'Menu Items',
      step: 3,
      fields: [
        { 
          label: 'Total Items', 
          value: `${formData.menuItems.length} items added` 
        },
        { 
          label: 'Menu File', 
          value: formData.menuFile ? formData.menuFile.name : 'No file uploaded' 
        },
        { 
          label: 'Menu URL', 
          value: formData.websiteMenuUrl || 'Not provided' 
        },
      ],
    },
    {
      title: 'Event Selection',
      step: 4,
      fields: [
        { label: 'Event', value: 'Hawaii Fest' },
        { label: 'Date', value: 'February 15-16, 2025' },
        { label: 'Location', value: 'Moanalua Gardens' },
      ],
    },
    {
      title: 'Documents',
      step: 5,
      fields: [
        { label: 'Business License', value: formData.hasBusinessLicense ? 'Yes' : 'No' },
        { label: 'Health Permit', value: formData.hasHealthPermit ? 'Yes' : 'No' },
        { label: 'Liability Insurance', value: formData.hasInsurance ? 'Yes' : 'No' },
      ],
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center">
          <Check className="h-5 w-5 text-blue-400" />
          <p className="ml-3 text-sm text-blue-700">
            Please review your information before submitting your application. Click the edit button to make changes to any section.
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {sections.map((section, index) => (
        <div key={index}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold gradient-text">{section.title}</h3>
            <button
              onClick={() => setCurrentStep(section.step)}
              className="flex items-center text-primary hover:text-secondary transition"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              <span className="text-sm">Edit</span>
            </button>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <dl className="grid grid-cols-1 gap-4">
              {section.fields.map((field, fieldIndex) => (
                <div key={fieldIndex} className="flex flex-col">
                  <dt className="text-sm font-medium text-gray-500">{field.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ))}

      {/* Payment Summary Section */}
      <div className="bg-white p-6 rounded-xl border-2 border-primary">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold gradient-text">Payment Summary</h3>
          <CreditCard className="h-6 w-6 text-primary" />
        </div>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <span className="text-gray-600">Registration Fee</span>
            <span className="font-semibold">${baseVendorFee.toFixed(2)}</span>
          </div>
          {formData.includeCanopy && (
            <div className="flex justify-between items-center pb-4 border-b">
              <span className="text-gray-600">10'x10' Canopy w/lighting</span>
              <span className="font-semibold">${canopyFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between items-center text-lg">
            <span className="font-bold">Total</span>
            <span className="font-bold gradient-text">${totalFee.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full gradient-bg text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
      >
        {isLoading ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Submitting...
          </>
        ) : (
          'Submit Application'
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        By submitting this application, you agree to our terms and conditions
      </p>
    </div>
  );
}

export default Review;
