import React, { useState } from 'react';
import { sendVerificationEmail, verifyEmailCode } from '../lib/email';
import { Loader, Mail } from 'lucide-react';

function TestEmail() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ success?: string; error?: string } | null>(null);
  const [verificationSent, setVerificationSent] = useState(false);

  const handleSendVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      await sendVerificationEmail(email);
      setVerificationSent(true);
      setStatus({ success: 'Verification code sent!' });
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Failed to send verification code' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const isValid = await verifyEmailCode(email, code);
      if (isValid) {
        setStatus({ success: 'Email verified successfully!' });
      } else {
        setStatus({ error: 'Invalid verification code' });
      }
    } catch (error) {
      setStatus({ error: error instanceof Error ? error.message : 'Failed to verify code' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Test Email Verification</h2>

      {status?.success && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-4">
          {status.success}
        </div>
      )}

      {status?.error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {status.error}
        </div>
      )}

      {!verificationSent ? (
        <form onSubmit={handleSendVerification} className="space-y-4">
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
      ) : (
        <form onSubmit={handleVerifyCode} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
              Verification Code
            </label>
            <input
              type="text"
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full gradient-bg text-white py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center"
          >
            {isLoading ? (
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
      )}
    </div>
  );
}

export default TestEmail;
