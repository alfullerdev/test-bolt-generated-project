import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Loader } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe('pk_test_51OoHVmBRrWVzxGxPxXpxPxXpxPxXpxPxXpxPxXpx');

function TestPayment() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe failed to initialize');

      // Create a payment intent
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 100 }), // $1.00 in cents
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret } = await response.json();

      // Confirm the payment
      const { error: paymentError } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: {
            number: '4242424242424242',
            exp_month: 12,
            exp_year: 2025,
            cvc: '123',
          },
        },
      });

      if (paymentError) {
        throw new Error(paymentError.message);
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Test $1 Payment</h2>
      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Test Card Details</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>Number: 4242 4242 4242 4242</p>
          <p>Expiry: 12/25</p>
          <p>CVC: 123</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
          Payment successful! $1.00 has been charged.
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isProcessing}
        className="w-full gradient-bg text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
      >
        {isProcessing ? (
          <>
            <Loader className="animate-spin h-5 w-5 mr-2" />
            Processing...
          </>
        ) : (
          <>
            <CreditCard className="h-5 w-5 mr-2" />
            Pay $1.00
          </>
        )}
      </button>
    </div>
  );
}

export default TestPayment;
