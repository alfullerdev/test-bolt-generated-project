import { supabase } from './supabase';
import { SignupFormData } from '../components/VendorSignup/VendorSignupForm';

export const createVendor = async (formData: SignupFormData, paymentIntentId: string) => {
  try {
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
      event_id: '00000000-0000-0000-0000-000000000000',
      payment_intent_id: paymentIntentId,
      status: 'pending_approval',
      payment_received: false
    };

    const { data: vendor, error } = await supabase
      .from('vendors')
      .insert([vendorData])
      .select()
      .single();

    if (error) throw error;
    if (!vendor) throw new Error('No vendor data returned');

    return vendor;
  } catch (error) {
    console.error('Error in createVendor:', error);
    throw error;
  }
};
