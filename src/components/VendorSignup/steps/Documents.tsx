import React from 'react';
import { SignupFormData } from '../VendorSignupForm';
import { Info } from 'lucide-react';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

function Documents({ formData, updateFormData }: Props) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex items-start">
          <Info className="h-5 w-5 text-blue-400 mt-0.5" />
          <p className="ml-3 text-sm text-blue-700">
            Please confirm that you have the following required documents. You'll need to provide these if your application is accepted.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="businessLicense"
            checked={formData.hasBusinessLicense}
            onChange={(e) => updateFormData({ hasBusinessLicense: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="businessLicense" className="ml-3">
            <span className="font-medium text-gray-900">Business License</span>
            <p className="text-sm text-gray-500">Valid business license from your local jurisdiction</p>
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="healthPermit"
            checked={formData.hasHealthPermit}
            onChange={(e) => updateFormData({ hasHealthPermit: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="healthPermit" className="ml-3">
            <span className="font-medium text-gray-900">Health Permit</span>
            <p className="text-sm text-gray-500">Current health department permit or certification</p>
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="insurance"
            checked={formData.hasInsurance}
            onChange={(e) => updateFormData({ hasInsurance: e.target.checked })}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="insurance" className="ml-3">
            <span className="font-medium text-gray-900">Liability Insurance</span>
            <p className="text-sm text-gray-500">Proof of liability insurance coverage</p>
          </label>
        </div>
      </div>
    </div>
  );
}

export default Documents;
