import React from 'react';
import { Store, TrendingUp, Truck, Receipt, Shield, Zap, CreditCard, Users, Globe2, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function ProductCard({ icon, title, description, features }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-bold mb-4 gradient-text">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Shield className="h-5 w-5 text-primary mt-0.5" />
            <span className="ml-3 text-gray-600">{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Products() {
  const products = [
    {
      icon: <Store className="h-10 w-10 text-primary" />,
      title: "Digital Storefront",
      description: "Launch your online store in minutes",
      features: [
        "Customizable store design",
        "Product catalog management",
        "Secure checkout process",
        "Mobile-optimized experience",
        "SEO optimization tools",
        "Social media integration"
      ]
    },
    {
      icon: <TrendingUp className="h-10 w-10 text-primary" />,
      title: "Business Analytics",
      description: "Make data-driven decisions",
      features: [
        "Real-time sales tracking",
        "Customer insights",
        "Performance metrics",
        "Growth analytics",
        "Custom reports",
        "Competitor analysis"
      ]
    },
    {
      icon: <Truck className="h-10 w-10 text-primary" />,
      title: "Inventory Management",
      description: "Streamline your operations",
      features: [
        "Stock level tracking",
        "Automated reordering",
        "Shipping integration",
        "Multi-location support",
        "Batch tracking",
        "Expiration date monitoring"
      ]
    }
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-primary/5 to-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold gradient-text mb-4">Vendor Solutions</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to run and grow your food & beverage business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <ProductCard key={index} {...product} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Integration Features</h2>
            <p className="text-xl text-gray-600">Connect with your favorite tools and services</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold">Payment Processing</h3>
            </div>
            <div className="text-center p-6">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold">CRM Systems</h3>
            </div>
            <div className="text-center p-6">
              <Globe2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold">Delivery Services</h3>
            </div>
            <div className="text-center p-6">
              <Receipt className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold">Accounting Software</h3>
            </div>
          </div>
        </div>

        <div className="gradient-bg rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to grow your business?</h2>
            <p className="mb-8 text-white/90">
              Join thousands of successful vendors already using Bev.Merch.Food
            </p>
            <Link
              to="/signin"
              className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-50 transition inline-flex items-center"
            >
              Get started now <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;
