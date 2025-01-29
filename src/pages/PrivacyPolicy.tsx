import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

function PrivacyPolicy() {
  return (
    <div className="pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start mb-6">
              <Shield className="h-6 w-6 text-primary mt-1" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold mb-4">Introduction</h2>
                <p className="text-gray-600">
                  Bev.Merch.Food ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start mb-6">
              <Eye className="h-6 w-6 text-primary mt-1" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
                <p className="text-gray-600 mb-4">
                  We collect information that you provide directly to us, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Name and contact information</li>
                  <li>Business details and documentation</li>
                  <li>Payment information</li>
                  <li>Menu and product information</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start mb-6">
              <Lock className="h-6 w-6 text-primary mt-1" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
                <p className="text-gray-600 mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Provide and improve our services</li>
                  <li>Process payments and transactions</li>
                  <li>Communicate with you about our services</li>
                  <li>Ensure platform security and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
            <div className="flex items-start mb-6">
              <FileText className="h-6 w-6 text-primary mt-1" />
              <div className="ml-4">
                <h2 className="text-2xl font-bold mb-4">Data Security</h2>
                <p className="text-gray-600 mb-4">
                  We implement appropriate security measures to protect your personal information, including:
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-2">
                  <li>Encryption of sensitive data</li>
                  <li>Regular security assessments</li>
                  <li>Access controls and authentication</li>
                  <li>Secure data storage and transmission</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="text-gray-600">
              <p>Bev.Merch.Food</p>
              <p>Email: privacy@bevmerchfood.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Address: 100 Market Street, Suite 300, San Francisco, CA 94105</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPolicy;
