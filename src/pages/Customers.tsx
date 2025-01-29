import React from 'react';
import { Star, TrendingUp, Users, Globe2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function TestimonialCard({ image, name, role, company, quote, stats }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <div className="flex items-start gap-4 mb-6">
        <img src={image} alt={name} className="w-16 h-16 rounded-full object-cover" />
        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-gray-600">{role} at {company}</p>
        </div>
      </div>
      <p className="text-gray-600 italic mb-6">"{quote}"</p>
      {stats && (
        <div className="border-t pt-6">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div key={index}>
                <p className="text-2xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function CaseStudyCard({ image, company, title, description, metrics }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <img src={image} alt={company} className="w-full h-48 object-cover" />
      <div className="p-8">
        <h3 className="font-bold text-xl mb-2">{company}</h3>
        <p className="font-medium text-primary mb-4">{title}</p>
        <p className="text-gray-600 mb-6">{description}</p>
        <div className="grid grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index}>
              <p className="text-2xl font-bold gradient-text">{metric.value}</p>
              <p className="text-sm text-gray-600">{metric.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Customers() {
  const testimonials = [
    {
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      name: "David Chen",
      role: "Founder & CEO",
      company: "Urban Bites",
      quote: "Bev.Merch.Food transformed our operations. The platform's intuitive design and powerful features helped us scale from a single location to a chain of 15 restaurants.",
      stats: [
        { value: "300%", label: "Revenue Growth" },
        { value: "15", label: "Locations" }
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      name: "Sarah Williams",
      role: "Operations Director",
      company: "Fresh Cup Coffee",
      quote: "The analytics tools provided invaluable insights that helped us optimize our menu and increase customer satisfaction. Our revenue has doubled since implementing Bev.Merch.Food.",
      stats: [
        { value: "100%", label: "Revenue Increase" },
        { value: "4.9★", label: "Customer Rating" }
      ]
    }
  ];

  const caseStudies = [
    {
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=400&fit=crop",
      company: "Healthy Eats Co.",
      title: "Scaling Operations Across Multiple Cities",
      description: "How a health food chain expanded to 25 locations using Bev.Merch.Food's platform.",
      metrics: [
        { value: "500%", label: "Growth in Orders" },
        { value: "25", label: "New Locations" }
      ]
    },
    {
      image: "https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&h=400&fit=crop",
      company: "Brew Masters",
      title: "Revolutionizing Craft Beer Distribution",
      description: "A craft brewery's journey to nationwide distribution with our platform.",
      metrics: [
        { value: "200%", label: "Distribution Growth" },
        { value: "50+", label: "Partner Stores" }
      ]
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold gradient-text mb-4">Our Customers</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how businesses are transforming their operations and growing with Bev.Merch.Food
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <Star className="h-8 w-8 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">4.9/5</div>
            <p className="text-gray-600">Customer Rating</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <TrendingUp className="h-8 w-8 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">250%</div>
            <p className="text-gray-600">Average Growth</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <Users className="h-8 w-8 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">10K+</div>
            <p className="text-gray-600">Active Users</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <Globe2 className="h-8 w-8 text-primary mx-auto mb-4" />
            <div className="text-3xl font-bold gradient-text mb-2">100+</div>
            <p className="text-gray-600">Countries</p>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold gradient-text text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>

        {/* Case Studies Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold gradient-text text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((study, index) => (
              <CaseStudyCard key={index} {...study} />
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="gradient-bg rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6">Join Our Success Story</h2>
          <p className="text-xl mb-8 text-white/90">
            Transform your business with Bev.Merch.Food's powerful platform
          </p>
          <Link
            to="/products"
            className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-50 transition inline-flex items-center"
          >
            Get started today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Customers;
