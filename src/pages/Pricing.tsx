import React from 'react';
import { Check } from 'lucide-react';

function PricingTier({ name, price, description, features, highlighted = false }) {
  return (
    <div className={`bg-white rounded-2xl p-8 ${highlighted ? 'ring-2 ring-primary shadow-xl' : 'shadow-lg'}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold mb-2 gradient-text">{name}</h3>
        <div className="mb-4">
          <span className="text-4xl font-bold">${price}</span>
          {price > 0 && <span className="text-gray-600">/month</span>}
        </div>
        <p className="text-gray-600">{description}</p>
      </div>
      <ul className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="h-5 w-5 text-primary mt-0.5" />
            <span className="ml-3 text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
      <button
        className={`w-full py-3 rounded-full transition ${
          highlighted
            ? 'gradient-bg text-white hover:opacity-90'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        }`}
      >
        Get started
      </button>
    </div>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: 0,
      description: "Perfect for testing and small projects",
      features: [
        "2.9% + 30¢ per transaction",
        "Basic fraud protection",
        "24/7 email support",
        "Standard payouts (2-3 business days)",
        "Up to 1,000 transactions/month"
      ]
    },
    {
      name: "Growth",
      price: 49,
      description: "For growing businesses and teams",
      features: [
        "2.5% + 25¢ per transaction",
        "Advanced fraud protection",
        "Priority email & chat support",
        "Fast payouts (1-2 business days)",
        "Up to 10,000 transactions/month",
        "Custom payment forms",
        "Team management"
      ],
      highlighted: true
    },
    {
      name: "Scale",
      price: 199,
      description: "For large-scale operations",
      features: [
        "2.2% + 20¢ per transaction",
        "Enterprise fraud protection",
        "24/7 phone, email & chat support",
        "Instant payouts",
        "Unlimited transactions",
        "Custom payment flows",
        "Advanced analytics",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-primary/5 to-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold gradient-text mb-4">Simple, transparent pricing</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the plan that best fits your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {tiers.map((tier, index) => (
              <PricingTier key={index} {...tier} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold gradient-text mb-6">Enterprise</h2>
          <p className="text-gray-600 mb-8">
            Need a custom solution? We offer tailored plans for large businesses
            with specific requirements and high transaction volumes.
          </p>
          <button className="gradient-bg text-white px-8 py-3 rounded-full hover:opacity-90 transition">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}

export default Pricing;
