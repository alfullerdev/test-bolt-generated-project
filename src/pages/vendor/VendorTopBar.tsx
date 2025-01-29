import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link, useNavigate } from 'react-router-dom';

function VendorTopBar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-50">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center flex-1">
          <h1 className="text-xl font-bold gradient-text">Vendor Dashboard</h1>
          <nav className="ml-8">
            <ul className="flex space-x-6">
              <li>
                <Link to="/vendor/dashboard" className="text-gray-600 hover:text-primary">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/vendor/orders" className="text-gray-600 hover:text-primary">
                  Orders
                </Link>
              </li>
              <li>
                <Link to="/vendor/menu" className="text-gray-600 hover:text-primary">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/vendor/settings" className="text-gray-600 hover:text-primary">
                  Settings
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg">
            <Bell className="h-5 w-5" />
          </button>
          <div className="relative">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 p-2 text-gray-700 hover:text-primary hover:bg-gray-50 rounded-lg"
            >
              <User className="h-5 w-5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorTopBar;
