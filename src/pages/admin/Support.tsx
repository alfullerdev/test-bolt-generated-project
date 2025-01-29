import React, { useState } from 'react';
import { MessageCircle, Mail, Phone, Globe2, Search, FileText, HelpCircle, ExternalLink } from 'lucide-react';

function Support() {
  const [searchQuery, setSearchQuery] = useState('');

  const helpArticles = [
    {
      title: 'Getting Started Guide',
      description: 'Learn the basics of using the admin dashboard',
      category: 'Basics',
      url: '#'
    },
    {
      title: 'Managing Vendors',
      description: 'How to approve, manage and monitor vendors',
      category: 'Vendors',
      url: '#'
    },
    {
      title: 'Event Management',
      description: 'Creating and managing events',
      category: 'Events',
      url: '#'
    },
    {
      title: 'Reports & Analytics',
      description: 'Understanding your data and reports',
      category: 'Analytics',
      url: '#'
    }
  ];

  const filteredArticles = helpArticles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Support Center</h1>
        <p className="text-gray-600">Get help and support for your admin dashboard</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <a href="#" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group">
          <MessageCircle className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2 group-hover:text-primary">Live Chat</h3>
          <p className="text-gray-600">Chat with our support team</p>
        </a>
        <a href="mailto:support@bev.merch.food" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group">
          <Mail className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2 group-hover:text-primary">Email Support</h3>
          <p className="text-gray-600">Get help via email</p>
        </a>
        <a href="tel:+18085551234" className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group">
          <Phone className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2 group-hover:text-primary">Phone Support</h3>
          <p className="text-gray-600">Call us for urgent issues</p>
        </a>
      </div>

      {/* Search */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="relative max-w-2xl mx-auto">
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Help Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {filteredArticles.map((article, index) => (
          <a
            key={index}
            href={article.url}
            className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition group"
          >
            <div className="flex items-start">
              <FileText className="h-6 w-6 text-primary mt-1" />
              <div className="ml-4 flex-1">
                <h3 className="font-bold mb-2 group-hover:text-primary">{article.title}</h3>
                <p className="text-gray-600 mb-2">{article.description}</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {article.category}
                </span>
              </div>
              <ExternalLink className="h-5 w-5 text-gray-400 group-hover:text-primary" />
            </div>
          </a>
        ))}
      </div>

      {/* Additional Resources */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-6 flex items-center">
          <HelpCircle className="h-6 w-6 text-primary mr-2" />
          Additional Resources
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a href="#" className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition">
            <Globe2 className="h-6 w-6 text-primary mr-3" />
            <div>
              <h3 className="font-medium">Documentation</h3>
              <p className="text-sm text-gray-600">Detailed technical documentation</p>
            </div>
          </a>
          <a href="#" className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition">
            <MessageCircle className="h-6 w-6 text-primary mr-3" />
            <div>
              <h3 className="font-medium">Community Forum</h3>
              <p className="text-sm text-gray-600">Connect with other admins</p>
            </div>
          </a>
          <a href="#" className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition">
            <FileText className="h-6 w-6 text-primary mr-3" />
            <div>
              <h3 className="font-medium">API Reference</h3>
              <p className="text-sm text-gray-600">Technical API documentation</p>
            </div>
          </a>
          <a href="#" className="flex items-center p-4 rounded-lg hover:bg-gray-50 transition">
            <Mail className="h-6 w-6 text-primary mr-3" />
            <div>
              <h3 className="font-medium">Newsletter</h3>
              <p className="text-sm text-gray-600">Stay updated with latest changes</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

export default Support;
