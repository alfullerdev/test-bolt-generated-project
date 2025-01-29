import React, { useState } from 'react';
import { SignupFormData } from '../VendorSignupForm';
import { Mail, Loader, AlertCircle } from 'lucide-react';
import { sendVerificationEmail, verifyEmailCode } from '../../../lib/email';

interface Props {
  formData: SignupFormData;
  updateFormData: (data: Partial<SignupFormData>) => void;
}

function EmailVerification({ formData, updateFormData }: Props) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await sendVerificationEmail(email);
      setVerificationSent(true);
      updateFormData({ email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    try {
      const isValid = await verifyEmailCode(email, verificationCode);
      
      if (!isValid) {
        throw new Error('Invalid verification code');
      }

      updateFormData({ email, isEmailVerified: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify code');
    } finally {
      setIsVerifying(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Check your email</h3>
          <p className="text-gray-600">
            We've sent a verification code to {email}
          </p>
        </div>

        <form onSubmit={handleVerifyCode} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isVerifying}
            className="w-full gradient-bg text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
          >
            {isVerifying ? (
              <>
                <Loader className="animate-spin h-5 w-5 mr-2" />
                Verifying...
              </>
            ) : (
              'Verify Code'
            )}
          </button>

          <button
            type="button"
            onClick={() => setVerificationSent(false)}
            className="w-full text-gray-600 hover:text-gray-900"
          >
            Use a different email
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSendVerification} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertCircle className="h-5 w-5 mt-0.5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="you@example.com"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full gradient-bg text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-5 w-5 mr-2" />
              Sending...
            </>
          ) : (
            'Send Verification Code'
          )}
        </button>
      </form>
    </div>
  );
}

export default EmailVerification;
