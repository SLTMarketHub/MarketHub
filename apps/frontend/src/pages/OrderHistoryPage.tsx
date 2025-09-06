import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { format } from 'date-fns';
import { Loader2, Package, CheckCircle, Truck, XCircle, Clock, ArrowLeft, RefreshCw } from 'lucide-react';

const OrderHistoryPage: React.FC = () => {
  const { orders, loading, error, getOrders } = useOrders();
  const { isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      getOrders();
    }
  }, [isAuthenticated, getOrders]);

  // Status icon component
  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'shipped':
        return <Truck className="h-5 w-5 text-blue-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
      case 'pending':
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize';
    const darkBaseClasses = 'dark:bg-opacity-20 dark:text-opacity-100';
    
    const getStatusClasses = (status: string) => {
      switch (status) {
        case 'delivered':
          return `bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
        case 'shipped':
          return `bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
        case 'processing':
        case 'pending':
          return `bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
        case 'cancelled':
          return `bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
        default:
          return `bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200`;
      }
    };
    
    return (
      <span className={`${baseClasses} ${getStatusClasses(status)} ${darkBaseClasses}`}>
        <StatusIcon status={status} />
        <span className="ml-1">{status}</span>
      </span>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md mx-auto">
          <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to view your orders</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your order history and track your orders.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login', { state: { from: '/orders' } })}
              className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-background p-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-4" />
        <p className="text-muted-foreground">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 dark:border-red-600 p-4 mb-6 max-w-4xl mx-auto mt-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Error loading orders</h3>
            <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
            <div className="mt-4">
              <button
                onClick={getOrders}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <RefreshCw className="-ml-0.5 mr-2 h-4 w-4" />
                Try again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <Package className="mx-auto h-16 w-16 text-muted-foreground opacity-50" />
        <h3 className="mt-4 text-lg font-medium text-foreground">No orders yet</h3>
        <p className="mt-1 text-muted-foreground max-w-md mx-auto">
          You haven't placed any orders yet. When you do, they'll appear here.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => navigate('/catalog')}
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Start Shopping
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md shadow-sm text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="-ml-1 mr-2 h-4 w-4" />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-200 ${theme}`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Order History</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View the status of recent orders, manage returns, and download invoices.
          </p>
        </div>
        
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-between items-center border-b border-gray-200">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order {order.orderNumber}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Placed on {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <StatusBadge status={order.status} />
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Details
                    <span className="sr-only">for order {order.orderNumber}</span>
                  </button>
                </div>
              </div>
              
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Total</p>
                    <p className="text-foreground font-medium">${order.total.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Items</p>
                    <p className="text-sm font-medium text-gray-900">
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    View Order
                  </button>
                  {order.status === 'delivered' && (
                    <button
                      onClick={() => {}}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Buy Again
                    </button>
                  )}
                  {order.status === 'cancelled' && (
                    <button
                      onClick={() => {}}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Reorder
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;
