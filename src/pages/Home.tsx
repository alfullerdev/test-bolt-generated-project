import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Store, TrendingUp, Truck, BarChart3, Globe2, Shield, ChevronRight } from 'lucide-react';

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-6 rounded-2xl hover:bg-gray-50 transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function Home() {
  return (
    <>
      <div className="relative pt-32 pb-40 px-4 sm:px-6 lg:px-8">
        {/* Video Background */}
        <div className="absolute inset-0 overflow-hidden">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay
            muted
            loop
            playsInline
          >
            <source 
              src="https://butilegsqtcfgtuvjqaf.supabase.co/storage/v1/object/public/user_photos//lady.mp4" 
              type="video/mp4"
            />
          </video>
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/60" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="max-w-3xl pl-4 md:pl-16">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
              <div>Grow your food &</div>
              <div>beverage business online</div>
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-10">
              Join vendors using Bev.Merch.Food to manage their operations, reach more customers, and scale their business.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/solutions" className="gradient-bg text-white px-8 py-4 rounded-full hover:opacity-90 transition flex items-center justify-center text-lg">
                Find out how <ArrowRight className="ml-2 h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Application Banner */}
      <div className="bg-gradient-to-r from-primary to-secondary py-8 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">HawaiiFest 2025 Vendor Applications</h2>
              <p className="text-white/90">Join us for Hawaii's premier food and beverage event</p>
            </div>
            <Link 
              to="/signup" 
              className="bg-white text-primary px-8 py-3 rounded-full hover:bg-opacity-90 transition flex items-center"
            >
              Apply Now <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>

      <div className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Store className="h-8 w-8 text-primary" />}
              title="Digital storefront"
              description="Create your branded online store with our easy-to-use platform. Showcase your products to customers worldwide."
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-primary" />}
              title="Sales analytics"
              description="Track your performance with real-time analytics. Make data-driven decisions to grow your business."
            />
            <FeatureCard
              icon={<Truck className="h-8 w-8 text-primary" />}
              title="Inventory management"
              description="Manage your stock levels, track shipments, and automate reordering all in one place."
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold gradient-text">
              Trusted by vendors worldwide
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 items-center justify-items-center opacity-60">
            <Store className="h-12 w-12 text-primary" />
            <BarChart3 className="h-12 w-12 text-primary" />
            <Globe2 className="h-12 w-12 text-primary" />
            <Shield className="h-12 w-12 text-primary" />
          </div>
        </div>
      </div>

      <div className="gradient-bg py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of successful vendors already using Bev.Merch.Food to reach more customers.
          </p>
          <Link to="/signup" className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-50 transition flex items-center mx-auto w-fit">
            Complete HawaiiFest 25 Vendor Application Here <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Home;
