import React, { useState } from 'react';
import { Clock, Package, X, User, MapPin, CreditCard } from 'lucide-react';

interface Order {
  id: string;
  orderNumber: string;
  createdAt: Date;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  totalItems: number;
  total: number;
  customer?: {
    name: string;
    email: string;
    phone: string;
  };
  items?: {
    name: string;
    quantity: number;
    price: number;
  }[];
  deliveryAddress?: string;
  paymentMethod?: string;
}

interface OrderModalProps {
  order: Order;
  onClose: () => void;
}

function OrderModal({ order, onClose }: OrderModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b sticky top-0 bg-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Order #{order.orderNumber}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {/* Order Status */}
          <div>
            <h3 className="font-semibold mb-2">Status</h3>
            <div className="flex items-center">
              <span className={`text-sm px-3 py-1 rounded-full ${getStatusColor(order.status)}`}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </span>
              <span className="text-sm text-gray-500 ml-2">
                {getWaitTime(order.createdAt, order.status)}
              </span>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-2">Customer</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-500 mr-2" />
                <span>{order.customer?.name || 'Guest Customer'}</span>
              </div>
              {order.customer?.email && (
                <div className="text-sm text-gray-600">{order.customer.email}</div>
              )}
              {order.customer?.phone && (
                <div className="text-sm text-gray-600">{order.customer.phone}</div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-2">Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <span className="text-gray-500 ml-2">x{item.quantity}</span>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Info */}
          {order.deliveryAddress && (
            <div>
              <h3 className="font-semibold mb-2">Delivery Address</h3>
              <div className="flex items-start bg-gray-50 p-4 rounded-lg">
                <MapPin className="h-4 w-4 text-gray-500 mr-2 mt-1" />
                <span>{order.deliveryAddress}</span>
              </div>
            </div>
          )}

          {/* Payment Info */}
          <div>
            <h3 className="font-semibold mb-2">Payment</h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                <span>{order.paymentMethod || 'Credit Card'}</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="font-medium">Total</span>
                <span className="font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t sticky bottom-0 bg-white">
          <div className="flex space-x-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
            <button className="flex-1 gradient-bg text-white px-4 py-2 rounded-lg hover:opacity-90">
              Update Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getWaitTime(createdAt: Date, status: Order['status']): string {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60));

  if (status === 'completed') {
    return 'Completed';
  }

  if (diffInMinutes < 60) {
    return `${diffInMinutes}m`;
  }

  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getStatusColor(status: Order['status']): string {
  switch (status) {
    case 'pending':
      return 'text-yellow-600 bg-yellow-50';
    case 'preparing':
      return 'text-blue-600 bg-blue-50';
    case 'ready':
      return 'text-green-600 bg-green-50';
    case 'completed':
      return 'text-gray-600 bg-gray-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}

function RecentOrders() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Mock data - in a real app, this would come from your backend
  const orders: Order[] = [
    {
      id: '1',
      orderNumber: '1001',
      createdAt: new Date(Date.now() - 15 * 60000), // 15 minutes ago
      status: 'preparing',
      totalItems: 3,
      total: 45.50,
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '(555) 123-4567'
      },
      items: [
        { name: 'Burger', quantity: 2, price: 15.00 },
        { name: 'Fries', quantity: 1, price: 5.50 },
        { name: 'Soda', quantity: 2, price: 5.00 }
      ],
      deliveryAddress: '123 Main St, Apt 4B, New York, NY 10001',
      paymentMethod: 'Visa ending in 4242'
    },
    {
      id: '2',
      orderNumber: '1002',
      createdAt: new Date(Date.now() - 45 * 60000), // 45 minutes ago
      status: 'pending',
      totalItems: 2,
      total: 27.80,
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '(555) 987-6543'
      },
      items: [
        { name: 'Pizza', quantity: 1, price: 18.00 },
        { name: 'Wings', quantity: 1, price: 9.80 }
      ],
      deliveryAddress: '456 Park Ave, New York, NY 10022',
      paymentMethod: 'Mastercard ending in 5555'
    },
    {
      id: '3',
      orderNumber: '1003',
      createdAt: new Date(Date.now() - 90 * 60000), // 90 minutes ago
      status: 'completed',
      totalItems: 5,
      total: 89.95,
      customer: {
        name: 'Bob Wilson',
        email: 'bob@example.com',
        phone: '(555) 555-5555'
      },
      items: [
        { name: 'Steak', quantity: 2, price: 35.00 },
        { name: 'Salad', quantity: 2, price: 8.00 },
        { name: 'Wine', quantity: 1, price: 3.95 }
      ],
      deliveryAddress: '789 Broadway, New York, NY 10003',
      paymentMethod: 'Apple Pay'
    }
  ];

  return (
    <>
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-white rounded-lg shadow">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                  <div className="flex items-center space-x-3 mt-1">
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-1" />
                      {order.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <span className="text-gray-300">•</span>
                    <div className="text-sm text-gray-500">
                      {order.totalItems} {order.totalItems === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold">${order.total.toFixed(2)}</p>
                <div className="flex items-center mt-1">
                  <span className={`text-sm px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="text-sm text-gray-500 ml-2">
                    {getWaitTime(order.createdAt, order.status)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}

export default RecentOrders;
