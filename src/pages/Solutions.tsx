import React from 'react';
import { Store, ShoppingBag, Utensils, Coffee } from 'lucide-react';

function SolutionCard({ icon, title, description, features }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-4 group-hover:text-primary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Solutions() {
  const solutions = [
    {
      icon: <Store className="h-10 w-10 text-primary" />,
      title: "Food Retailers",
      description: "Complete solutions for food stores and markets",
      features: [
        "Inventory management",
        "Point of sale integration",
        "Customer loyalty programs",
        "Multi-location support"
      ]
    },
    {
      icon: <Utensils className="h-10 w-10 text-primary" />,
      title: "Restaurants",
      description: "Digital solutions for restaurants",
      features: [
        "Online ordering system",
        "Table management",
        "Kitchen display system",
        "Delivery integration"
      ]
    },
    {
      icon: <Coffee className="h-10 w-10 text-primary" />,
      title: "Beverage Vendors",
      description: "Specialized tools for beverage businesses",
      features: [
        "Recipe management",
        "Temperature monitoring",
        "Quality control",
        "Batch tracking"
      ]
    },
    {
      icon: <ShoppingBag className="h-10 w-10 text-primary" />,
      title: "Food Manufacturers",
      description: "Enterprise solutions for manufacturers",
      features: [
        "Production planning",
        "Supply chain management",
        "Quality assurance",
        "Compliance tracking"
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
              Tailored solutions for every type of food & beverage business
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {solutions.map((solution, index) => (
              <SolutionCard key={index} {...solution} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-20">
        <div className="gradient-bg rounded-2xl p-8 md:p-12 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Need a custom solution?</h2>
            <p className="mb-8 text-white/90">
              Our team of experts can help you design and implement
              the perfect solution for your unique business needs.
            </p>
            <button className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-50 transition">
              Talk to an expert
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Solutions;
