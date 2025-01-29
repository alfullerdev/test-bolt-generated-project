import React, { useState } from 'react';
import { SignupFormData } from '../VendorSignupForm';
import { AlertCircle, User } from 'lucide-react';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

function BusinessDetails({ formData, updateFormData }: Props) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const businessTypes = [
    'Restaurant',
    'Food Truck',
    'Bakery',
    'Beverage Vendor',
    'Specialty Foods'
  ];

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          return `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        }
        if (value.trim().length < 2) {
          return `${name === 'firstName' ? 'First' : 'Last'} name must be at least 2 characters`;
        }
        return undefined;

      case 'businessName':
        if (!value.trim()) {
          return 'Business name is required';
        }
        if (value.trim().length < 2) {
          return 'Business name must be at least 2 characters';
        }
        if (value.trim().length > 100) {
          return 'Business name must be less than 100 characters';
        }
        return undefined;

      case 'businessType':
        if (!value) {
          return 'Please select a business type';
        }
        return undefined;

      case 'getLicenseNumber':
        if (!value.trim()) {
          return 'GET License Number is required';
        }
        return undefined;

      case 'website':
        if (value) {
          const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
          if (!urlPattern.test(value)) {
            return 'Please enter a valid website URL';
          }
        }
        return undefined;

      default:
        return undefined;
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value });
    
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name*
          </label>
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.firstName ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.firstName && touched.firstName && (
            <div className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.firstName}
            </div>
          )}
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name*
          </label>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                errors.lastName ? 'border-red-300' : 'border-gray-300'
              }`}
              required
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          {errors.lastName && touched.lastName && (
            <div className="mt-1 text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.lastName}
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
          Business Name*
        </label>
        <input
          type="text"
          id="businessName"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.businessName ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        />
        {errors.businessName && touched.businessName && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.businessName}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
          Business Type*
        </label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.businessType ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        >
          <option value="">Select a business type</option>
          {businessTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
        {errors.businessType && touched.businessType && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.businessType}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="getLicenseNumber" className="block text-sm font-medium text-gray-700 mb-1">
          GET License Number*
        </label>
        <input
          type="text"
          id="getLicenseNumber"
          name="getLicenseNumber"
          value={formData.getLicenseNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.getLicenseNumber ? 'border-red-300' : 'border-gray-300'
          }`}
          required
        />
        {errors.getLicenseNumber && touched.getLicenseNumber && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.getLicenseNumber}
          </div>
        )}
      </div>

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
          Website (Optional)
        </label>
        <input
          type="url"
          id="website"
          name="website"
          value={formData.website}
          onChange={handleChange}
          onBlur={handleBlur}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.website ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="https://"
        />
        {errors.website && touched.website && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.website}
          </div>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Include https:// for external websites
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Business Description (Optional)
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          rows={4}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
            errors.description ? 'border-red-300' : 'border-gray-300'
          }`}
        ></textarea>
        {errors.description && touched.description && (
          <div className="mt-1 text-sm text-red-600 flex items-center">
            <AlertCircle className="h-4 w-4 mr-1" />
            {errors.description}
          </div>
        )}
        <p className="mt-1 text-sm text-gray-500">
          Describe your business, specialties, and what makes you unique.
        </p>
        <div className="mt-1 text-sm text-gray-500">
          Characters: {formData.description.length}
        </div>
      </div>
    </div>
  );
}

export default BusinessDetails;
