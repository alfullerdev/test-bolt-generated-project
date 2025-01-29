import React from 'react';
import { CreditCard, Clock, Receipt, Shield, Download, History, Bell, Settings } from 'lucide-react';

function BillingPage() {
  const currentPlan = {
    name: "Professional",
    price: 99,
    billingCycle: "monthly",
    nextBilling: "April 15, 2024"
  };

  const recentTransactions = [
    {
      date: "Mar 15, 2024",
      description: "Monthly subscription",
      amount: -99.00,
      status: "Completed"
    },
    {
      date: "Mar 10, 2024",
      description: "Platform fees",
      amount: -45.30,
      status: "Completed"
    },
    {
      date: "Mar 5, 2024",
      description: "Payout",
      amount: 1250.80,
      status: "Completed"
    }
  ];

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-4">Billing & Payments</h1>
          <p className="text-xl text-gray-600">
            Manage your subscription, payment methods, and billing history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Plan */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold mb-2">Current Plan</h2>
                  <p className="text-gray-600">
                    You are currently on the {currentPlan.name} plan
                  </p>
                </div>
                <button className="gradient-bg text-white px-6 py-2 rounded-full hover:opacity-90 transition">
                  Upgrade Plan
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CreditCard className="h-6 w-6 text-primary mt-1" />
                  <div className="ml-4">
                    <h3 className="font-semibold mb-1">Billing Amount</h3>
                    <p className="text-gray-600">${currentPlan.price}/month</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary mt-1" />
                  <div className="ml-4">
                    <h3 className="font-semibold mb-1">Next Billing Date</h3>
                    <p className="text-gray-600">{currentPlan.nextBilling}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white p-8 rounded-2xl shadow-lg mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Payment Methods</h2>
                <button className="text-primary hover:text-secondary transition">
                  + Add new card
                </button>
              </div>
              <div className="border rounded-xl p-4 mb-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-gray-100 p-2 rounded-lg">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold">•••• •••• •••• 4242</p>
                    <p className="text-sm text-gray-600">Expires 12/25</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                  Default
                </span>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Recent Transactions</h2>
                <button className="text-primary hover:text-secondary transition flex items-center">
                  <Download className="h-4 w-4 mr-2" />
                  Download all
                </button>
              </div>
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={index} className="flex items-center justify-between py-4 border-b last:border-0">
                    <div className="flex items-center">
                      <div className="bg-gray-100 p-2 rounded-lg">
                        {transaction.amount > 0 ? (
                          <History className="h-5 w-5 text-green-600" />
                        ) : (
                          <Receipt className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="ml-4">
                        <p className="font-semibold">{transaction.description}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? 'text-green-600' : 'text-gray-900'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)} USD
                      </p>
                      <p className="text-sm text-gray-600">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing Settings Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Billing Settings</h2>
              <div className="space-y-6">
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 text-primary" />
                    <span className="ml-3">Notifications</span>
                  </div>
                  <Settings className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-primary" />
                    <span className="ml-3">Security</span>
                  </div>
                  <Settings className="h-5 w-5 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition">
                  <div className="flex items-center">
                    <Receipt className="h-5 w-5 text-primary" />
                    <span className="ml-3">Invoices</span>
                  </div>
                  <Settings className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BillingPage;
