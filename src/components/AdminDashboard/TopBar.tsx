import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

function TopBar() {
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
          <h1 className="text-xl font-bold gradient-text">Admin Dashboard</h1>
          <div className="ml-8 flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
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

export default TopBar;
