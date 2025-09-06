import React, { useState } from 'react';
import { Package, CreditCard, Bell, User, Settings, BarChart3, Clock } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';

export const CustomerDashboard: React.FC = () => {
  const { orders, notifications } = useData();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const recentOrders = orders.slice(0, 5);
  const recentNotifications = notifications.slice(0, 5);

  const stats = [
    {
      title: 'Active Services',
      value: '12',
      icon: Package,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Total Orders',
      value: '47',
      icon: BarChart3,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Monthly Spend',
      value: '$289',
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'Support Tickets',
      value: '2',
      icon: Clock,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-blue-100 text-blue-800';
      case 'Fulfilled':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600">Manage your services and track your orders</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'orders', label: 'Orders', icon: Package },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'profile', label: 'Profile', icon: User },
              { id: 'settings', label: 'Settings', icon: Settings }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
                  <div className="space-y-3">
                    {recentOrders.map((order) => (
                      <div key={order.orderId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">Order #{order.orderId.slice(-8)}</p>
                          <p className="text-sm text-gray-600">Welcome to Market Hub!</p>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                          <p className="text-sm text-gray-900 font-medium mt-1">${order.totalAmount}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Notifications */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Notifications</h3>
                  <div className="space-y-3">
                    {recentNotifications.map((notification) => (
                      <div key={notification.notificationId} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                        <div className={`p-2 rounded-lg ${
                          notification.type === 'OrderConfirmation' ? 'bg-green-100' :
                          notification.type === 'Promotion' ? 'bg-blue-100' :
                          'bg-yellow-100'
                        }`}>
                          <Bell className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{notification.type}</p>
                          <p className="text-sm text-gray-600">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(notification.sentAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Order ID</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.orderId} className="border-b border-gray-100">
                        <td className="py-3 px-4">#{order.orderId.slice(-8)}</td>
                        <td className="py-3 px-4">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">${order.totalAmount}</td>
                        <td className="py-3 px-4">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">View Details</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Notifications</h3>
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <div key={notification.notificationId} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg">
                    <div className={`p-2 rounded-lg ${
                      notification.type === 'OrderConfirmation' ? 'bg-green-100' :
                      notification.type === 'Promotion' ? 'bg-blue-100' :
                      'bg-yellow-100'
                    }`}>
                      <Bell className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{notification.type}</p>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(notification.sentAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      notification.status === 'Sent' ? 'bg-green-100 text-green-800' :
                      notification.status === 'Failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
              <div className="max-w-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                    <input
                      type="text"
                      value={user?.name?.split(' ')[0] || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      value={user?.name?.split(' ')[1] || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email || ''}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      value="+1 (555) 123-4567"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Notification Preferences</h4>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Order confirmations</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" defaultChecked />
                      <span className="ml-2 text-sm text-gray-700">Promotional offers</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="ml-2 text-sm text-gray-700">Partner communications</span>
                    </label>
                  </div>
                </div>
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-3">Security</h4>
                  <div className="space-y-3">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Change Password</button>
                    <br />
                    <button className="text-blue-600 hover:text-blue-800 text-sm">Enable Two-Factor Authentication</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};