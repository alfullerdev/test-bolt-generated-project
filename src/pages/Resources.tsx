import React from 'react';
import { BookOpen, FileText, MessageCircle, Users } from 'lucide-react';

function ResourceCard({ icon, title, description, link }) {
  return (
    <a href={link} className="block group">
      <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
        <div className="mb-6">{icon}</div>
        <h3 className="text-xl font-bold mb-4 group-hover:text-primary">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </a>
  );
}

function Resources() {
  const resources = [
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Blog",
      description: "Latest updates, best practices, and insights from the Bev.Merch.Food team",
      link: "#"
    },
    {
      icon: <FileText className="h-10 w-10 text-primary" />,
      title: "Case Studies",
      description: "Learn how businesses succeed with Bev.Merch.Food's solutions",
      link: "#"
    },
    {
      icon: <MessageCircle className="h-10 w-10 text-primary" />,
      title: "Community",
      description: "Join discussions and share experiences with other Bev.Merch.Food users",
      link: "#"
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Events",
      description: "Webinars, workshops, and conferences to help you grow",
      link: "#"
    }
  ];

  return (
    <div className="pb-20">
      <div className="bg-gradient-to-br from-primary/5 to-white pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold gradient-text mb-4">Resources</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to succeed with Bev.Merch.Food
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <ResourceCard key={index} {...resource} />
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold gradient-text mb-6">Stay Updated</h2>
          <p className="text-gray-600 mb-8">
            Subscribe to our newsletter for the latest updates, product news, and industry insights.
          </p>
          <form className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-grow px-4 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <button
                type="submit"
                className="gradient-bg text-white px-6 py-3 rounded-full hover:opacity-90 transition"
              >
                Subscribe
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Resources;
