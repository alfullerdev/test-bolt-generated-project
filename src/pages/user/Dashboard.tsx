import React from 'react';
import { ShoppingBag, Heart, Clock, Settings } from 'lucide-react';

function UserDashboard() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome Back!</h1>
        <p className="text-gray-600">Manage your orders and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <ShoppingBag className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2">Recent Orders</h3>
          <p className="text-gray-600">View your order history</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Heart className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2">Favorites</h3>
          <p className="text-gray-600">Your favorite items</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Clock className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2">Order Status</h3>
          <p className="text-gray-600">Track your orders</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <Settings className="h-8 w-8 text-primary mb-4" />
          <h3 className="font-bold mb-2">Settings</h3>
          <p className="text-gray-600">Manage preferences</p>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;
