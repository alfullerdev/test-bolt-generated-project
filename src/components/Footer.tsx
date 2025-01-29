import React from 'react';
import { Link } from 'react-router-dom';
import { Globe2 } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link to="/products#payments" className="hover:text-white">Payments</Link></li>
              <li><Link to="/products#billing" className="hover:text-white">Billing</Link></li>
              <li><Link to="/products#connect" className="hover:text-white">Connect</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Developers</h3>
            <ul className="space-y-2">
              <li><Link to="/developers#documentation" className="hover:text-white">Documentation</Link></li>
              <li><Link to="/developers#api" className="hover:text-white">API Reference</Link></li>
              <li><Link to="/developers#support" className="hover:text-white">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/customers" className="hover:text-white">Customers</Link></li>
              <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <Link to="/" className="flex items-center mb-4 md:mb-0">
            <Globe2 className="h-8 w-8 text-white" />
            <span className="ml-2 text-xl font-bold text-white">Bev.Merch.Food</span>
          </Link>
          <div className="text-sm">
            © 2025 Bev.Merch.Food, Inc. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
