import React from 'react';
import { Briefcase } from 'lucide-react';

function Careers() {
  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold gradient-text mb-4">Careers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in building the future of beverage and food infrastructure
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-white p-12 rounded-2xl shadow-lg text-center">
            <Briefcase className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold gradient-text mb-4">Coming Soon</h2>
            <p className="text-gray-600 text-lg mb-8">
              We're preparing something exciting! Check back soon to explore career opportunities at Bev.Merch.Food.
            </p>
            <button className="gradient-bg text-white px-8 py-3 rounded-full hover:opacity-90 transition">
              Notify me when jobs are posted
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Careers;
