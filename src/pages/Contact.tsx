import React, { useState } from 'react';
import { MapPin, Phone, Mail, MessageCircle, Clock, Globe2 } from 'lucide-react';

function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: 'General Inquiry',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
          Company Name
        </label>
        <input
          type="text"
          id="company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <select
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          <option value="General Inquiry">General Inquiry</option>
          <option value="Sales">Sales</option>
          <option value="Technical Support">Technical Support</option>
          <option value="Partnership">Partnership</option>
          <option value="Press">Press</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          required
        ></textarea>
      </div>

      <button
        type="submit"
        className="w-full gradient-bg text-white py-3 rounded-lg hover:opacity-90 transition"
      >
        Send Message
      </button>
    </form>
  );
}

function LocationCard({ city, address, phone, email, hours }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <h3 className="text-xl font-bold mb-6">{city}</h3>
      <div className="space-y-4">
        <div className="flex items-start">
          <MapPin className="h-5 w-5 text-primary mt-1" />
          <p className="ml-4 text-gray-600">{address}</p>
        </div>
        <div className="flex items-start">
          <Phone className="h-5 w-5 text-primary mt-1" />
          <p className="ml-4 text-gray-600">{phone}</p>
        </div>
        <div className="flex items-start">
          <Mail className="h-5 w-5 text-primary mt-1" />
          <p className="ml-4 text-gray-600">{email}</p>
        </div>
        <div className="flex items-start">
          <Clock className="h-5 w-5 text-primary mt-1" />
          <p className="ml-4 text-gray-600">{hours}</p>
        </div>
      </div>
    </div>
  );
}

function Contact() {
  const locations = [
    {
      city: "San Francisco (HQ)",
      address: "100 Market Street, Suite 300, San Francisco, CA 94105",
      phone: "+1 (415) 555-0123",
      email: "sf@bevmerchfood.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM PT"
    },
    {
      city: "London",
      address: "25 Old Broad Street, London EC2N 1HQ, UK",
      phone: "+44 20 7123 4567",
      email: "london@bevmerchfood.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM GMT"
    },
    {
      city: "Singapore",
      address: "1 Raffles Place, #20-61 Tower 2, Singapore 048616",
      phone: "+65 6789 0123",
      email: "singapore@bevmerchfood.com",
      hours: "Mon-Fri: 9:00 AM - 6:00 PM SGT"
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold gradient-text mb-4">Contact Us</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get in touch with our team. We're here to help you succeed.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <MessageCircle className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Chat with Us</h3>
            <p className="text-gray-600 mb-4">Get instant support through our live chat</p>
            <button className="text-primary hover:text-secondary transition">Start Chat</button>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <Mail className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Email Us</h3>
            <p className="text-gray-600 mb-4">Send us an email anytime</p>
            <a href="mailto:support@bevmerchfood.com" className="text-primary hover:text-secondary transition">
              support@bevmerchfood.com
            </a>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <Globe2 className="h-8 w-8 text-primary mx-auto mb-4" />
            <h3 className="font-bold mb-2">Visit Help Center</h3>
            <p className="text-gray-600 mb-4">Find answers to common questions</p>
            <button className="text-primary hover:text-secondary transition">Browse FAQs</button>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold gradient-text mb-6">Send Us a Message</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and we'll get back to you as soon as possible.
            </p>
            <ContactForm />
          </div>
          <div className="bg-gray-50 p-8 rounded-2xl">
            <h2 className="text-3xl font-bold gradient-text mb-6">Support Hours</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Technical Support</h3>
                <p className="text-gray-600">24/7 support for urgent issues</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Sales Inquiries</h3>
                <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM PT</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Response Time</h3>
                <p className="text-gray-600">We aim to respond to all inquiries within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* Office Locations */}
        <div>
          <h2 className="text-3xl font-bold gradient-text text-center mb-12">Our Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {locations.map((location, index) => (
              <LocationCard key={index} {...location} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
