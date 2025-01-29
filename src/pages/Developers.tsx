import React from 'react';
import { Code2, Book, Terminal, Puzzle } from 'lucide-react';

function CodeExample() {
  return (
    <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg overflow-x-auto">
      <code>{`// Initialize Bev.Merch.Food
const bmf = new BevMerchFood('pk_test_123');

// Create an order
const order = await bmf.createOrder({
  amount: 2000,
  currency: 'usd',
  payment_method: 'card',
  confirm: true,
});`}</code>
    </pre>
  );
}

function Developers() {
  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-primary/5 to-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold gradient-text mb-4">Developers</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build and scale your food and beverage infrastructure with our powerful APIs
            </p>
          </div>

          <div className="mb-20">
            <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-2xl font-bold gradient-text mb-4">Quick Start</h2>
                  <p className="text-gray-600 mb-6">
                    Get started with Bev.Merch.Food in minutes. Our SDKs and comprehensive
                    documentation make it easy to integrate our platform into your application.
                  </p>
                  <CodeExample />
                </div>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <Code2 className="h-6 w-6 text-primary mt-1" />
                    <div className="ml-4">
                      <h3 className="font-semibold mb-2">Modern SDKs</h3>
                      <p className="text-gray-600">
                        Native SDKs for every major platform and framework
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Book className="h-6 w-6 text-primary mt-1" />
                    <div className="ml-4">
                      <h3 className="font-semibold mb-2">Detailed Documentation</h3>
                      <p className="text-gray-600">
                        Clear, comprehensive guides and API references
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Terminal className="h-6 w-6 text-primary mt-1" />
                    <div className="ml-4">
                      <h3 className="font-semibold mb-2">Testing Tools</h3>
                      <p className="text-gray-600">
                        Robust testing environment with test API keys
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Puzzle className="h-6 w-6 text-primary mt-1" />
                    <div className="ml-4">
                      <h3 className="font-semibold mb-2">Sample Projects</h3>
                      <p className="text-gray-600">
                        Example implementations for common use cases
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <a href="#" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary">
                  API Reference
                </h3>
                <p className="text-gray-600">
                  Complete API documentation with examples and response schemas
                </p>
              </div>
            </a>
            <a href="#" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary">
                  Libraries & SDKs
                </h3>
                <p className="text-gray-600">
                  Official client libraries for popular languages and frameworks
                </p>
              </div>
            </a>
            <a href="#" className="block group">
              <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-bold mb-4 group-hover:text-primary">
                  Support
                </h3>
                <p className="text-gray-600">
                  Get help from our developer support team and community
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Developers;
