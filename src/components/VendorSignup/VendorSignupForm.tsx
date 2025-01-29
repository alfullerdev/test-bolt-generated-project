import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, AlertCircle, Globe2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import BasicInfo from './steps/BasicInfo';
import BusinessDetails from './steps/BusinessDetails';
import MenuDetails from './steps/MenuDetails';
import MenuItems from './steps/MenuItems';
import EventSelection from './steps/EventSelection';
import Documents from './steps/Documents';
import Payment from './steps/Payment';
import Payout from './steps/Payout';
import Review from './steps/Review';

export interface SignupFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  isEmailVerified?: boolean;
  businessName: string;
  businessType: string;
  getLicenseNumber: string;
  website: string;
  description: string;
  cuisineTypes: string[];
  dietaryOptions: string[];
  priceRange: number;
  servingCapacity: number;
  menuItems: MenuItem[];
  menuFile?: File;
  websiteMenuUrl?: string;
  eventId: string;
  hasBusinessLicense: boolean;
  hasHealthPermit: boolean;
  hasInsurance: boolean;
  includeCanopy?: boolean;
  payoutMethod?: 'bank' | 'platform';
  bankDetails?: {
    nickname: string;
    routingNumber: string;
    accountNumber: string;
  };
  platformDetails?: {
    type: 'stripe' | 'square';
    apiKey: string;
  };
}

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: string;
  dietaryTags: string[];
}

const initialFormData: SignupFormData = {
  firstName: '',
  lastName: '',
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
  eventId: '',
  hasBusinessLicense: false,
  hasHealthPermit: false,
  hasInsurance: false,
  includeCanopy: false,
};

const steps = [
  { title: 'Basic Info', component: BasicInfo },
  { title: 'Business', component: BusinessDetails },
  { title: 'Menu', component: MenuDetails },
  { title: 'Menu Items', component: MenuItems },
  { title: 'Event', component: EventSelection },
  { title: 'Documents', component: Documents },
  { title: 'Payment', component: Payment },
  { title: 'Payout', component: Payout },
  { title: 'Review', component: Review },
];

function VendorSignupForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<SignupFormData>(initialFormData);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [existingVendorFound, setExistingVendorFound] = useState(false);

  useEffect(() => {
    const savedProgress = localStorage.getItem('vendorFormProgress');
    if (savedProgress) {
      const { completedSteps: saved, formData: savedData } = JSON.parse(savedProgress);
      setCompletedSteps(saved);
      setFormData(prev => ({ ...prev, ...savedData }));
    }
  }, []);

  useEffect(() => {
    if (formData.email) {
      localStorage.setItem('vendorFormProgress', JSON.stringify({
        completedSteps,
        formData
      }));
    }
  }, [completedSteps, formData]);

  useEffect(() => {
    const checkExistingVendor = async () => {
      if (formData.email && formData.phone) {
        setError(null);
        try {
          const { data, error } = await supabase
            .from('vendors')
            .select('*')
            .eq('email', formData.email)
            .eq('phone', formData.phone)
            .maybeSingle();

          if (error && error.code !== 'PGRST116') {
            throw error;
          }

          if (data) {
            const convertedData = {
              firstName: data.first_name,
              lastName: data.last_name,
              email: data.email,
              phone: data.phone,
              businessName: data.business_name,
              businessType: data.business_type,
              getLicenseNumber: data.get_license_number,
              website: data.website || '',
              description: data.description || '',
              cuisineTypes: data.cuisine_types || [],
              dietaryOptions: data.dietary_options || [],
              priceRange: data.price_range || 50,
              servingCapacity: data.serving_capacity || 100,
              menuItems: data.menu_items || [],
              eventId: data.event_id,
              hasBusinessLicense: data.has_business_license || false,
              hasHealthPermit: data.has_health_permit || false,
              hasInsurance: data.has_insurance || false,
              includeCanopy: data.include_canopy || false,
            };

            setFormData(prev => ({
              ...prev,
              ...convertedData
            }));
            setExistingVendorFound(true);
          } else if (currentStep === 0) {
            setError('No vendor account found with these credentials. Please check your email and phone number.');
          }
        } catch (err) {
          console.error('Error checking vendor:', err);
          setError(err instanceof Error ? err.message : 'Failed to check vendor status');
        }
      }
    };

    checkExistingVendor();
  }, [formData.email, formData.phone]);

  const validateStep = async (step: number): Promise<boolean> => {
    setValidationError(null);
    setIsValidating(true);

    try {
      switch (step) {
        case 0:
          if (!formData.email?.trim()) {
            setValidationError('Email is required');
            return false;
          }
          if (!formData.phone.trim()) {
            setValidationError('Phone number is required');
            return false;
          }
          if (!/^\(\d{3}\) \d{3}-\d{4}$/.test(formData.phone)) {
            setValidationError('Please enter a valid phone number');
            return false;
          }
          return true;

        case 1:
          if (!formData.firstName?.trim()) {
            setValidationError('First name is required');
            return false;
          }
          if (!formData.lastName?.trim()) {
            setValidationError('Last name is required');
            return false;
          }
          if (!formData.businessName.trim()) {
            setValidationError('Business name is required');
            return false;
          }
          if (!formData.businessType) {
            setValidationError('Please select a business type');
            return false;
          }
          if (!formData.getLicenseNumber.trim()) {
            setValidationError('GET License Number is required');
            return false;
          }
          if (formData.website && !/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(formData.website)) {
            setValidationError('Please enter a valid website URL');
            return false;
          }
          return true;

        case 2:
          return true;

        case 3:
          if (formData.menuItems.length === 0 && !formData.menuFile && !formData.websiteMenuUrl) {
            setValidationError('Please add at least one menu item or upload a menu file');
            return false;
          }
          return true;

        case 4:
          if (!formData.eventId) {
            setValidationError('Please select an event');
            return false;
          }
          return true;

        case 5:
          if (!formData.hasBusinessLicense || !formData.hasHealthPermit || !formData.hasInsurance) {
            setValidationError('Please confirm you have all required documents');
            return false;
          }
          return true;

        default:
          return true;
      }
    } catch (err) {
      setValidationError('An error occurred during validation');
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid) {
      // For step 0, only proceed if we found a vendor
      if (currentStep === 0 && !existingVendorFound) {
        setError('No vendor account found with these credentials. Please check your email and phone number.');
        return;
      }

      // Clear any existing errors
      setError(null);

      if (!completedSteps.includes(currentStep)) {
        setCompletedSteps([...completedSteps, currentStep]);
      }
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setValidationError(null);
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  const updateFormData = (data: Partial<SignupFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setValidationError(null);
    // Reset existingVendorFound when email or phone changes
    if ('email' in data || 'phone' in data) {
      setExistingVendorFound(false);
      setError(null);
    }
  };

  const renderCurrentStep = () => {
    const StepComponent = steps[currentStep].component;
    return (
      <StepComponent
        formData={formData}
        updateFormData={updateFormData}
        setCurrentStep={setCurrentStep}
      />
    );
  };

  const renderStepIndicator = () => {
    if (!existingVendorFound && currentStep === 0) return null;
    
    return (
      <div className="flex items-center justify-between mb-6 px-4">
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex items-center flex-1 last:flex-none"
          >
            <div 
              className={`
                flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center cursor-pointer
                ${currentStep === index 
                  ? 'border-primary text-primary' 
                  : completedSteps.includes(index)
                    ? 'border-green-500 text-green-500 hover:bg-green-50'
                    : 'border-gray-300 text-gray-400'
                }
                transition-colors duration-200
              `}
              onClick={() => {
                if (completedSteps.includes(index)) {
                  setCurrentStep(index);
                }
              }}
            >
              {completedSteps.includes(index) ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className="text-sm">{index + 1}</span>
              )}
            </div>
            {index < steps.length - 1 && (
              <div 
                className={`
                  flex-1 h-0.5 mx-2
                  ${completedSteps.includes(index) 
                    ? 'bg-green-500' 
                    : 'bg-gray-300'
                  }
                `}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#FF512F] via-[#DD2476] to-[#FF512F]/90 pb-8 pt-24">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1464618663641-bbdd760ae84a?w=1920&q=80')] bg-cover bg-center mix-blend-overlay opacity-10"></div>
      
      <div className="relative w-full max-w-3xl mx-auto px-2">
        <div className="text-center mb-2">
          <h1 className="text-2xl font-bold text-white">
            Complete your HawaiiFest 2025 Vendor Application
          </h1>
          {currentStep === 0 && (
            <p className="text-white/80">
              Enter your credentials to continue your application
            </p>
          )}
          {existingVendorFound && currentStep === 1 && (
            <p className="text-white/80">
              We found your previous information. Please verify and update if needed.
            </p>
          )}
        </div>

        <div className="bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-xl">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-start text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          {validationError && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-start text-sm">
              <AlertCircle className="h-4 w-4 mt-0.5 mr-2" />
              <span>{validationError}</span>
            </div>
          )}

          {renderStepIndicator()}

          <div>
            {renderCurrentStep()}
          </div>

          <div className="mt-4 flex justify-between">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="flex items-center text-gray-600 hover:text-gray-900 transition text-sm"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            )}
            {currentStep < steps.length - 1 && (
              <button
                onClick={nextStep}
                className="gradient-bg text-white px-3 py-1.5 rounded-full hover:opacity-90 transition ml-auto flex items-center text-sm"
              >
                {currentStep === 0 ? 'Find Account' : 'Next'}
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorSignupForm;
