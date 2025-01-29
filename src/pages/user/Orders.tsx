import React from 'react';
import { Package, Clock, MapPin, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  total: number;
  items: {
    name: string;
    quantity: number;
    price: number;
  }[];
  vendor: string;
}

function Orders() {
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      date: '2024-03-15',
      status: 'completed',
      total: 45.99,
      items: [
        { name: 'Burger', quantity: 2, price: 15.99 },
        { name: 'Fries', quantity: 1, price: 4.99 },
        { name: 'Drink', quantity: 2, price: 4.99 }
      ],
      vendor: 'Burger Palace'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      date: '2024-03-14',
      status: 'processing',
      total: 32.50,
      items: [
        { name: 'Pizza', quantity: 1, price: 24.99 },
        { name: 'Salad', quantity: 1, price: 7.99 }
      ],
      vendor: 'Pizza Express'
    }
  ];

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Orders</h1>
        <p className="text-gray-600">View and track your orders</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Package className="h-6 w-6 text-primary mr-3" />
                  <div>
                    <h3 className="font-bold">Order #{order.orderNumber}</h3>
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4 mr-1" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>

              <div className="border-t border-b border-gray-100 py-4 mb-4">
                <div className="text-sm text-gray-500 mb-2">Items:</div>
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between text-sm mb-1">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  <span className="font-medium text-gray-900">Total:</span> ${order.total.toFixed(2)}
                </div>
                <button className="text-primary hover:text-secondary transition">
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Orders;
