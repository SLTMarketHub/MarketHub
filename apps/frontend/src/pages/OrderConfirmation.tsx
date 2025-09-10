import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Truck, Clock, Mail, Home } from 'lucide-react';

export const OrderConfirmation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location as { state?: { orderNumber?: string; estimatedDelivery?: string } };

  // Redirect to home if accessed directly without order data
  useEffect(() => {
    if (!state?.orderNumber) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state?.orderNumber) {
    return null;
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Thank you for your order!
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Your order has been placed and is being processed. We'll send you a confirmation email shortly.
          </p>
          <p className="mt-2 text-gray-900 font-medium">
            Order #{state.orderNumber}
          </p>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Order Status</h2>
            
            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Order Confirmed</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We've received your order and it's being processed.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-yellow-100">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Processing</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    We're preparing your items for shipping.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-100">
                    <Truck className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-900">Shipped</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Estimated delivery: <span className="font-medium">{state.estimatedDelivery}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-6 py-4 sm:px-8 border-t border-gray-200">
            <div className="flex items-center">
              <Mail className="h-5 w-5 text-gray-400" />
              <p className="ml-2 text-sm text-gray-600">
                We've sent order confirmation and receipt to your email.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-medium text-gray-900 mb-6">What's next?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-base font-medium text-blue-800 mb-2">Track your order</h3>
                <p className="text-sm text-blue-700 mb-4">
                  We'll send you shipping confirmation when your item(s) are on the way!
                </p>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Track Order
                </button>
              </div>
              
              <div className="bg-purple-50 p-6 rounded-lg">
                <h3 className="text-base font-medium text-purple-800 mb-2">Need help?</h3>
                <p className="text-sm text-purple-700 mb-4">
                  Have questions about your order? Our customer service team is here to help.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-purple-700 bg-purple-100 hover:bg-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                >
                  Contact Support
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="-ml-1 mr-2 h-5 w-5" />
            Back to Home
          </Link>
          <Link
            to="/account/orders"
            className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View Order History
          </Link>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need to make changes to your order?{' '}
            <a href="/contact" className="font-medium text-blue-600 hover:text-blue-500">
              Contact us
            </a>{' '}
            within 1 hour of placing your order.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
