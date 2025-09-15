import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrders } from '../contexts/OrderContext';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  CheckCircle, 
  Clock, 
  CreditCard, 
  Package,
  RefreshCw, 
  Truck, 
  XCircle,
  Printer,
  Download,
  MessageSquare
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

const OrderDetailPage: React.FC = () => {
  const { theme } = useTheme();
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder, updateOrderStatus } = useOrders();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch order details with optimized loading
  useEffect(() => {
    let isMounted = true;
    
    const fetchOrder = async () => {
      if (!orderId) {
        console.error('No order ID provided');
        navigate('/orders');
        return;
      }
      
      if (!isAuthenticated) {
        console.error('User not authenticated');
        navigate('/login', { state: { from: `/orders/${orderId}` } });
        return;
      }
      
      // Only set loading if we don't have the order data yet
      if (!order || order.id !== orderId) {
        setIsLoading(true);
      }
      setError(null);
      
      try {
        console.log(`Fetching order with ID: ${orderId}`);
        const orderData = await getOrder(orderId);
        console.log('Order data received:', orderData);
        
        if (!isMounted) return;
        
        if (orderData) {
          setOrder(orderData);
        } else {
          console.error('Order not found');
          navigate('/orders', { replace: true });
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        if (isMounted) {
          setError('Failed to load order details. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    // Only fetch if we don't have the order or if the order ID changed
    if (!order || order.id !== orderId) {
      fetchOrder();
    } else {
      setIsLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [orderId, isAuthenticated, getOrder, navigate, order]);

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (!order || order.status !== 'pending') return;
    
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    setIsCancelling(true);
    setCancelError(null);
    
    try {
      const success = await updateOrderStatus(order.id, 'cancelled');
      if (success) {
        setOrder({ ...order, status: 'cancelled' });
      } else {
        setCancelError('Failed to cancel order. Please try again.');
      }
    } catch (err) {
      console.error('Error cancelling order:', err);
      setCancelError('An error occurred while cancelling the order.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Define the type for a step
  type Step = {
    id: string;
    content: string | React.ReactNode;
  };

  // Get next steps based on order status with unique keys
  const getNextSteps = (status: string): Step[] => {
    const steps: Step[] = [];
    
    switch (status) {
      case 'pending':
        steps.push(
          { id: 'pending-1', content: 'Your order is being processed.' },
          { id: 'pending-2', content: 'You\'ll receive a confirmation when your order ships.' }
        );
        break;
      case 'processing':
        steps.push(
          { id: 'processing-1', content: 'We\'re preparing your items for shipment.' },
          { id: 'processing-2', content: 'You\'ll receive tracking information once your order ships.' }
        );
        break;
      case 'shipped':
        steps.push(
          { id: 'shipped-1', content: 'Your order is on its way!' },
          { id: 'shipped-2', content: `Estimated delivery: ${order?.estimatedDelivery || '3-5 business days'}` }
        );
        if (order?.trackingUrl) {
          steps.push({
            id: 'shipped-3',
            content: (
              <a
                href={order.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                Track your package
              </a>
            )
          });
        }
        break;
      case 'delivered':
        steps.push(
          { id: 'delivered-1', content: 'Your order has been delivered.' },
          { id: 'delivered-2', content: 'We hope you love your purchase!' }
        );
        break;
      case 'cancelled':
        steps.push(
          { id: 'cancelled-1', content: 'This order has been cancelled.' },
          { id: 'cancelled-2', content: 'If you have any questions, please contact our support team.' }
        );
        break;
      default:
        break;
    }
    
    return steps;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-background">
        <div className="text-center p-6 max-w-md mx-auto">
          <Package className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Sign in to view order details</h2>
          <p className="text-muted-foreground mb-6">Please sign in to view your order details and track your order.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login', { state: { from: `/orders/${orderId}` } })}
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
        <div className="text-center max-w-md">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
          <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
          <Link 
            to="/orders" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <ArrowLeft className="-ml-1 mr-2 h-5 w-5" />
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <XCircle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-600 dark:hover:text-red-200"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const nextSteps = getNextSteps(order.status);



  // Main content
  return (
    <div className={`min-h-screen bg-background transition-colors duration-200 ${theme}`}>
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
            aria-label="Back to orders"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to orders
          </button>
          <div className="mt-2 flex flex-col sm:flex-row justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">Order {order?.orderNumber || 'Loading...'}</h1>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => window.print()}
                className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Print order details"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={() => {}}
                className="inline-flex items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Download invoice"
              >
                <Download className="h-4 w-4 mr-2" />
                Invoice
              </button>
              <button
                onClick={() => {}}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Get help with this order"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Get Help
              </button>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Order Status</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${
                order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30' : 
                order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30' : 
                order.status === 'processing' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 
                'bg-red-100 dark:bg-red-900/30'
              }`}>
                {order.status === 'delivered' ? (
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                ) : order.status === 'shipped' ? (
                  <Truck className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                ) : order.status === 'processing' ? (
                  <RefreshCw className="h-6 w-6 text-yellow-600 dark:text-yellow-400 animate-spin" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-foreground">
                  {order.status === 'delivered' ? 'Delivered' : 
                   order.status === 'shipped' ? 'Shipped' : 
                   order.status === 'processing' ? 'Processing' : 'Cancelled'}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {order.status === 'delivered' ? 
                    `Your order was delivered on ${format(new Date(order.updatedAt), 'MMMM d, yyyy')}` :
                   order.status === 'shipped' ? 
                    `Your order is on its way. Expected delivery: ${format(new Date(order.expectedDelivery), 'MMMM d, yyyy')}` :
                   order.status === 'processing' ? 
                    'We are processing your order. You will receive an email when it ships.' :
                    'This order has been cancelled.'}
                </p>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="mt-8">
              <h4 className="text-sm font-medium text-foreground mb-4">Order Timeline</h4>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    ['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? 
                    'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {['pending', 'processing', 'shipped', 'delivered'].includes(order.status) ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">Order Placed</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(order.createdAt), 'MMMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    ['processing', 'shipped', 'delivered'].includes(order.status) ? 
                    'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {['processing', 'shipped', 'delivered'].includes(order.status) ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">Order Processed</p>
                    <p className="text-xs text-muted-foreground">
                      {order.processedAt ? 
                        format(new Date(order.processedAt), 'MMMM d, yyyy h:mm a') : 
                        'Your order is being processed'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    ['shipped', 'delivered'].includes(order.status) ? 
                    'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {['shipped', 'delivered'].includes(order.status) ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">Order Shipped</p>
                    <p className="text-xs text-muted-foreground">
                      {order.shippedAt ? 
                        `Shipped on ${format(new Date(order.shippedAt), 'MMMM d, yyyy')}` : 
                        'Your order will ship soon'}
                    </p>
                    {order.trackingNumber && (
                      <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
                        Tracking: {order.trackingNumber}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-start">
                  <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                    order.status === 'delivered' ? 
                    'bg-green-100 dark:bg-green-900/30' : 'bg-gray-100 dark:bg-gray-800'
                  }`}>
                    {order.status === 'delivered' ? (
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">Order Delivered</p>
                    <p className="text-xs text-muted-foreground">
                      {order.deliveredAt ? 
                        `Delivered on ${format(new Date(order.deliveredAt), 'MMMM d, yyyy')}` : 
                        'Estimated delivery: ' + (order.expectedDelivery ? 
                          format(new Date(order.expectedDelivery), 'MMMM d, yyyy') : 'Calculating...')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border mb-8">
          <div className="px-4 py-5 sm:px-6 border-b border-border">
            <h2 className="text-lg font-medium text-foreground">Order Details</h2>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-muted-foreground">Order number</dt>
                <dd className="mt-1 text-sm text-foreground">{order.orderNumber}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-muted-foreground">Date placed</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {format(new Date(order.createdAt), 'MMMM d, yyyy')}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-muted-foreground">Payment method</dt>
                <dd className="mt-1 text-sm text-foreground">
                  {order.paymentMethod?.type === 'credit_card' && 'Credit card ending in ' + (order.paymentMethod?.last4 || '****')}
                  {order.paymentMethod?.type === 'paypal' && 'PayPal'}
                  {order.paymentMethod?.type === 'bank' && 'Bank transfer'}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-muted-foreground">Email address</dt>
                <dd className="mt-1 text-sm text-foreground">{order.email}</dd>
              </div>
              {order.phone && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Phone number</dt>
                  <dd className="mt-1 text-sm text-foreground">{order.phone}</dd>
                </div>
              )}
              {order.trackingNumber && (
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-muted-foreground">Tracking number</dt>
                  <dd className="mt-1 text-sm text-foreground">
                    {order.trackingUrl ? (
                      <a 
                        href={order.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {order.trackingNumber}
                      </a>
                    ) : (
                      order.trackingNumber
                    )}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Left Column - Order Summary and Next Steps */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Summary Card */}
            <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h2 className="text-lg font-medium text-foreground">Order Summary</h2>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="divide-y divide-border">
                  {order.items.map((item: any) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
                        <img
                          src={item.image || 'https://via.placeholder.com/80'}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <div>
                          <h4 className="text-base font-medium text-foreground">
                            {item.name}
                          </h4>
                          <p className="mt-1 text-sm text-muted-foreground">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="mt-6 border-t border-border pt-6">
                  <div className="flex justify-between text-base font-medium text-foreground">
                    <p>Subtotal</p>
                    <p>${order.subtotal.toFixed(2)}</p>
                  </div>
                  <div className="mt-2 flex justify-between text-base font-medium text-foreground">
                    <p>Shipping</p>
                    <p>${order.shipping.toFixed(2)}</p>
                  </div>
                  {order.tax > 0 && (
                    <div className="mt-2 flex justify-between text-base font-medium text-foreground">
                      <p>Tax</p>
                      <p>${order.tax.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="mt-4 pt-4 flex justify-between text-lg font-bold text-foreground border-t border-border">
                    <p>Total</p>
                    <p>${order.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h3 className="text-lg font-medium text-foreground">Next Steps</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <ul className="space-y-4">
                  {nextSteps.map((step) => (
                    <li key={step.id} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{step.content}</span>
                    </li>
                  ))}
                </ul>

                {order.status === 'pending' && (
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleCancelOrder}
                      disabled={isCancelling}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isCancelling ? 'Cancelling...' : 'Cancel Order'}
                    </button>
                    {cancelError && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400">{cancelError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Information */}
          <div className="space-y-6">
            {/* Shipping Address */}
            <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h3 className="text-lg font-medium text-foreground">Shipping Address</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Package className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">
                      {order.shippingAddress.firstName} {order.shippingAddress.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {order.shippingAddress.address}<br />
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                      {order.shippingAddress.country}
                    </p>
                    {order.shippingAddress.phone && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.shippingAddress.phone}
                      </p>
                    )}
                    {order.shippingAddress.email && (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {order.shippingAddress.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h3 className="text-lg font-medium text-foreground">Payment Method</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-foreground">
                      {order.paymentMethod?.type === 'credit_card' && 'Credit Card'}
                      {order.paymentMethod?.type === 'paypal' && 'PayPal'}
                      {order.paymentMethod?.type === 'bank' && 'Bank Transfer'}
                    </p>
                    {order.paymentMethod?.type === 'credit_card' && order.paymentMethod.last4 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Ending with •••• {order.paymentMethod.last4}
                      </p>
                    )}
                    {(order.paymentMethod?.type === 'paypal' || order.paymentMethod?.type === 'bank') && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.paymentMethod.type === 'paypal' ? 'Paid with PayPal' : 'Bank transfer'}
                      </p>
                    )}
                    <p className="mt-1 text-sm text-muted-foreground capitalize">
                      Status: {order.status}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-card shadow overflow-hidden sm:rounded-lg border border-border">
              <div className="px-4 py-5 sm:px-6 border-b border-border">
                <h3 className="text-lg font-medium text-foreground">Need Help?</h3>
              </div>
              <div className="px-4 py-5 sm:p-6">
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions about your order, our customer service team is happy to help.
                </p>
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-border shadow-sm text-sm font-medium rounded-md text-foreground bg-card hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Customer Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
