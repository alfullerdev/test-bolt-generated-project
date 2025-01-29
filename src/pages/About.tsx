import React from 'react';
import { Target, Heart, Globe2, Users, Award, Rocket, Link as LinkIcon, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

function ValueCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function TeamMember({ image, name, role, description }) {
  return (
    <div className="text-center">
      <img
        src={image}
        alt={name}
        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
      />
      <h3 className="text-xl font-bold mb-2">{name}</h3>
      <p className="text-primary mb-2">{role}</p>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function About() {
  const values = [
    {
      icon: <Target className="h-8 w-8 text-primary" />,
      title: "Mission-Driven",
      description: "Empowering food and beverage businesses with technology to reach their full potential."
    },
    {
      icon: <Heart className="h-8 w-8 text-primary" />,
      title: "Customer First",
      description: "Every decision we make starts with our customers' needs and success."
    },
    {
      icon: <Globe2 className="h-8 w-8 text-primary" />,
      title: "Global Impact",
      description: "Building solutions that help businesses thrive across borders and cultures."
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Community",
      description: "Fostering a supportive ecosystem of vendors, partners, and customers."
    }
  ];

  const team = [
    {
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop",
      name: "David Chen",
      role: "CEO & Co-founder",
      description: "Former restaurant owner with 15 years of industry experience."
    },
    {
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&h=200&fit=crop",
      name: "Sarah Williams",
      role: "CTO",
      description: "Tech veteran with expertise in scalable platforms."
    },
    {
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
      name: "Michael Brown",
      role: "Head of Operations",
      description: "Supply chain expert focused on vendor success."
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl font-bold gradient-text mb-6">Our Story</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Founded in 2020, Bev.Merch.Food was born from a simple idea: make it easier for food and beverage 
            businesses to succeed in the digital age. Today, we're proud to serve thousands of vendors worldwide.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold gradient-text mb-2">10K+</div>
            <p className="text-gray-600">Active Vendors</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold gradient-text mb-2">50M+</div>
            <p className="text-gray-600">Orders Processed</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="text-4xl font-bold gradient-text mb-2">100+</div>
            <p className="text-gray-600">Countries Served</p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} {...value} />
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Our Team</h2>
            <p className="text-xl text-gray-600">Meet the people building the future of F&B infrastructure</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <TeamMember key={index} {...member} />
            ))}
          </div>
        </div>

        {/* Locations Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold gradient-text mb-4">Global Presence</h2>
            <p className="text-xl text-gray-600">Serving customers from our offices worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <span>San Francisco (HQ)</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <span>London</span>
            </div>
            <div className="flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary mr-2" />
              <span>Singapore</span>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="gradient-bg rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Join Our Journey</h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our team and help build the future of F&B infrastructure.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/careers"
              className="bg-white text-primary px-8 py-3 rounded-full hover:bg-gray-50 transition flex items-center"
            >
              View Careers <Rocket className="ml-2 h-5 w-5" />
            </Link>
            <Link
              to="/contact"
              className="border border-white text-white px-8 py-3 rounded-full hover:bg-white/10 transition flex items-center"
            >
              Contact Us <LinkIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default About;
