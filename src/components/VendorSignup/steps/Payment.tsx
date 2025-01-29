import React, { useState, useCallback, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Lock, AlertCircle, Tent } from 'lucide-react';
import { SignupFormData } from '../VendorSignupForm';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

function Payment({ formData, updateFormData }: Props) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payByCheck, setPayByCheck] = useState(false);
  const [includeCanopy, setIncludeCanopy] = useState(false);

  const baseVendorFee = formData.businessType === 'Food Truck' ? 2000 : 1500;
  const canopyFee = 1500;
  const totalFee = baseVendorFee + (includeCanopy ? canopyFee : 0);

  // Initialize canopy state from formData
  useEffect(() => {
    setIncludeCanopy(formData.includeCanopy || false);
  }, [formData.includeCanopy]);

  // Handle canopy option change
  const handleCanopyChange = useCallback((checked: boolean) => {
    setIncludeCanopy(checked);
    updateFormData({ includeCanopy: checked });
  }, [updateFormData]);

  const handlePayment = async () => {
    if (payByCheck) {
      // Handle check payment flow
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const stripe = await loadStripe('your_publishable_key');
      if (!stripe) throw new Error('Stripe failed to initialize');

      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalFee * 100, // Convert to cents
          eventId: formData.eventId,
        }),
      });

      const { clientSecret } = await response.json();

      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            // Card details would be collected via Stripe Elements
          },
          billing_details: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
          },
        },
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-start">
          <Lock className="h-5 w-5 text-blue-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Secure Payment</h3>
            <p className="mt-1 text-sm text-blue-700">
              Your payment is secured with industry-standard encryption
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Vendor Registration Fee</h3>
          <span className="text-2xl font-bold">${baseVendorFee.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm mb-6">
          This fee covers your participation in the selected event
        </p>

        {/* Additional Canopy Option */}
        <div className="border-t border-gray-200 pt-4 mb-6">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={includeCanopy}
              onChange={(e) => handleCanopyChange(e.target.checked)}
              className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            />
            <div className="flex-1">
              <div className="flex items-center">
                <Tent className="h-5 w-5 text-primary mr-2" />
                <span className="font-medium">Additional 10'x10' Canopy w/lighting</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Includes setup and teardown, professional-grade canopy with LED lighting
              </p>
              <p className="text-sm font-semibold text-primary mt-1">
                + $1,500.00
              </p>
            </div>
          </label>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total</span>
            <span>${totalFee.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={!payByCheck}
              onChange={() => setPayByCheck(false)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span>Pay with Credit Card</span>
          </label>
          
          <label className="flex items-center space-x-3">
            <input
              type="radio"
              checked={payByCheck}
              onChange={() => setPayByCheck(true)}
              className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
            />
            <span>Mail in Check</span>
          </label>
        </div>
        
        {payByCheck ? (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6 mt-6">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Important:</strong> Your vendor application will not be complete until we receive your payment. Please mail your check to:
                </p>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Mail Checks to:</p>
                  <p>1003 Bishop Street</p>
                  <p>Suite 2700 #539</p>
                  <p>Honolulu, HI 96813</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Card Information
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Card number"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <CreditCard className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  placeholder="MM / YY"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <input
                  type="text"
                  placeholder="CVC"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 p-4 rounded-lg">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={processing}
        className="w-full gradient-bg text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Processing...' : payByCheck ? 'Continue with Check Payment' : `Pay $${totalFee.toFixed(2)}`}
      </button>

      <p className="text-center text-sm text-gray-500">
        By proceeding with the payment, you agree to our terms and conditions
      </p>
    </div>
  );
}

export default Payment;
