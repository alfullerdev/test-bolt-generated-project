import React, { useState } from 'react';
import { Ban as Bank, CreditCard, AlertCircle, Loader } from 'lucide-react';

interface Props {
  formData: any;
  updateFormData: (data: any) => void;
}

function Payout({ formData, updateFormData }: Props) {
  const [payoutMethod, setPayoutMethod] = useState<'bank' | 'platform' | null>(null);
  const [platform, setPlatform] = useState<'stripe' | 'square' | null>(null);
  const [bankDetails, setBankDetails] = useState({
    nickname: '',
    routingNumber: '',
    accountNumber: '',
    confirmAccountNumber: ''
  });
  const [platformDetails, setPlatformDetails] = useState({
    apiKey: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleBankDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBankDetails(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const handlePlatformDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlatformDetails(prev => ({
      ...prev,
      apiKey: e.target.value
    }));
    setError(null);
  };

  const validateBankDetails = () => {
    if (!bankDetails.nickname.trim()) {
      setError('Account nickname is required');
      return false;
    }
    if (!/^\d{9}$/.test(bankDetails.routingNumber)) {
      setError('Please enter a valid 9-digit routing number');
      return false;
    }
    if (!/^\d{4,17}$/.test(bankDetails.accountNumber)) {
      setError('Please enter a valid account number');
      return false;
    }
    if (bankDetails.accountNumber !== bankDetails.confirmAccountNumber) {
      setError('Account numbers do not match');
      return false;
    }
    return true;
  };

  const validatePlatformDetails = () => {
    if (!platform) {
      setError('Please select a platform');
      return false;
    }
    if (!platformDetails.apiKey.trim()) {
      setError('API key is required');
      return false;
    }
    return true;
  };

  const handleVerify = async () => {
    setIsVerifying(true);
    setError(null);

    try {
      if (payoutMethod === 'bank') {
        if (!validateBankDetails()) {
          setIsVerifying(false);
          return;
        }
        // Here you would typically verify the bank account details
        // For now, we'll just simulate a successful verification
        updateFormData({
          payoutMethod: 'bank',
          bankDetails: {
            nickname: bankDetails.nickname,
            routingNumber: bankDetails.routingNumber,
            accountNumber: bankDetails.accountNumber
          }
        });
      } else if (payoutMethod === 'platform') {
        if (!validatePlatformDetails()) {
          setIsVerifying(false);
          return;
        }
        // Here you would typically verify the platform API key
        updateFormData({
          payoutMethod: 'platform',
          platformDetails: {
            type: platform,
            apiKey: platformDetails.apiKey
          }
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-700">
          Choose how you would like to receive your payments
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-4">
        <label className="flex items-start space-x-3">
          <input
            type="radio"
            checked={payoutMethod === 'bank'}
            onChange={() => setPayoutMethod('bank')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <Bank className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Bank Account (1-3 business days)</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Receive payments directly to your bank account
            </p>
          </div>
        </label>

        <label className="flex items-start space-x-3">
          <input
            type="radio"
            checked={payoutMethod === 'platform'}
            onChange={() => setPayoutMethod('platform')}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300"
          />
          <div className="flex-1">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 text-primary mr-2" />
              <span className="font-medium">Payment Platform</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Connect your existing Stripe or Square account
            </p>
          </div>
        </label>
      </div>

      {payoutMethod === 'bank' && (
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Nickname
            </label>
            <input
              type="text"
              name="nickname"
              value={bankDetails.nickname}
              onChange={handleBankDetailsChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="e.g., Business Checking"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Routing Number
            </label>
            <input
              type="text"
              name="routingNumber"
              value={bankDetails.routingNumber}
              onChange={handleBankDetailsChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="9 digits"
              maxLength={9}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Number
            </label>
            <input
              type="text"
              name="accountNumber"
              value={bankDetails.accountNumber}
              onChange={handleBankDetailsChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Enter account number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Account Number
            </label>
            <input
              type="text"
              name="confirmAccountNumber"
              value={bankDetails.confirmAccountNumber}
              onChange={handleBankDetailsChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="Re-enter account number"
            />
          </div>
        </div>
      )}

      {payoutMethod === 'platform' && (
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Platform
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPlatform('stripe')}
                className={`p-4 border rounded-lg flex items-center justify-center ${
                  platform === 'stripe'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                }`}
              >
                Stripe
              </button>
              <button
                type="button"
                onClick={() => setPlatform('square')}
                className={`p-4 border rounded-lg flex items-center justify-center ${
                  platform === 'square'
                    ? 'border-primary text-primary bg-primary/5'
                    : 'border-gray-300 text-gray-700 hover:border-primary hover:text-primary'
                }`}
              >
                Square
              </button>
            </div>
          </div>

          {platform && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {platform === 'stripe' ? 'Stripe' : 'Square'} API Key
              </label>
              <input
                type="text"
                value={platformDetails.apiKey}
                onChange={handlePlatformDetailsChange}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={`Enter your ${platform} API key`}
              />
            </div>
          )}
        </div>
      )}

      {payoutMethod && (
        <button
          onClick={handleVerify}
          disabled={isVerifying}
          className="w-full gradient-bg text-white py-3 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
        >
          {isVerifying ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Verifying...
            </>
          ) : (
            'Verify & Continue'
          )}
        </button>
      )}
    </div>
  );
}

export default Payout;
