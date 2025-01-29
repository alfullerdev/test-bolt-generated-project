import React from 'react';
import { SignupFormData } from '../VendorSignupForm';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

function MenuDetails({ formData, updateFormData }: Props) {
  const dietaryOptions = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Dairy-Free',
    'Nut-Free',
    'Organic',
    'Low-Carb',
    'Keto-Friendly'
  ];

  const handleDietaryChange = (option: string) => {
    const updatedOptions = formData.dietaryOptions.includes(option)
      ? formData.dietaryOptions.filter(type => type !== option)
      : [...formData.dietaryOptions, option];
    updateFormData({ dietaryOptions: updatedOptions });
  };

  return (
    <div className="space-y-8">
      {/* Dietary Options */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Menu Dietary Restrictions
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {dietaryOptions.map((option) => (
            <label key={option} className="flex items-center">
              <input
                type="checkbox"
                checked={formData.dietaryOptions.includes(option)}
                onChange={() => handleDietaryChange(option)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">{option}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuDetails;
