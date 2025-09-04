import React, { useState } from 'react';
import { Search, Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';

export const OrderTracking: React.FC = () => {
  const { orders } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filteredOrders = orders.filter(order => 
    order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'Fulfilled':
        return <Package className="w-5 h-5 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

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

  const getOrderSteps = (status: string) => {
    const steps = [
      { name: 'Order Placed', completed: true },
      { name: 'Order Confirmed', completed: status !== 'Pending' },
      { name: 'Processing', completed: status === 'Approved' || status === 'Fulfilled' },
      { name: 'Fulfilled', completed: status === 'Fulfilled' }
    ];
    return steps;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Tracking</h1>
        <p className="text-gray-600">Track your orders and view order history</p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by order ID or customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div key={order.orderId} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order #{order.orderId.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Placed on {new Date(order.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <button
                    onClick={() => setSelectedOrder(selectedOrder === order.orderId ? null : order.orderId)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    {selectedOrder === order.orderId ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Package className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Product</p>
                    <p className="text-sm font-medium text-gray-900">{order.productId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Customer</p>
                    <p className="text-sm font-medium text-gray-900">{order.customerId}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 text-gray-400">$</div>
                  <div>
                    <p className="text-sm text-gray-600">Amount</p>
                    <p className="text-sm font-medium text-gray-900">${order.totalAmount}</p>
                  </div>
                </div>
              </div>

              {/* Order Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  {getOrderSteps(order.status).map((step, index) => (
                    <div key={index} className="flex items-center">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                        step.completed 
                          ? 'bg-green-500 border-green-500 text-white' 
                          : 'bg-white border-gray-300 text-gray-400'
                      }`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <span className="text-xs">{index + 1}</span>
                        )}
                      </div>
                      <div className="ml-2">
                        <p className={`text-sm font-medium ${
                          step.completed ? 'text-green-600' : 'text-gray-400'
                        }`}>
                          {step.name}
                        </p>
                      </div>
                      {index < getOrderSteps(order.status).length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${
                          step.completed ? 'bg-green-500' : 'bg-gray-300'
                        }`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Expanded Details */}
              {selectedOrder === order.orderId && (
                <div className="border-t border-gray-200 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Order ID:</span>
                          <span className="text-sm font-medium text-gray-900">{order.orderId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Customer ID:</span>
                          <span className="text-sm font-medium text-gray-900">{order.customerId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Product ID:</span>
                          <span className="text-sm font-medium text-gray-900">{order.productId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Payment Status:</span>
                          <span className={`text-sm font-medium ${
                            order.paymentStatus === 'Paid' ? 'text-green-600' :
                            order.paymentStatus === 'Refunded' ? 'text-yellow-600' :
                            'text-red-600'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Total Amount:</span>
                          <span className="text-sm font-medium text-gray-900">${order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Currency:</span>
                          <span className="text-sm font-medium text-gray-900">{order.currency}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-3">Order Timeline</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Order Placed</p>
                            <p className="text-xs text-gray-500">{new Date(order.orderDate).toLocaleString()}</p>
                          </div>
                        </div>
                        {order.status !== 'Pending' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Order Confirmed</p>
                              <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                        {order.status === 'Fulfilled' && (
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">Order Fulfilled</p>
                              <p className="text-xs text-gray-500">{new Date(order.updatedAt).toLocaleString()}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-3">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Download Invoice
                    </button>
                    {order.status === 'Pending' && (
                      <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">
                        Cancel Order
                      </button>
                    )}
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                      Contact Support
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredOrders.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm ? 'No orders match your search criteria' : 'You haven\'t placed any orders yet'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Search
            </button>
          )}
        </div>
      )}
    </div>
  );
};