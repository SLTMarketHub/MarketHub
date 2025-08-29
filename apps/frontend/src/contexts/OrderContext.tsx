import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Order, OrderSummary, OrderStatus } from '../types/order';

interface OrderContextType {
  orders: OrderSummary[];
  loading: boolean;
  error: string | null;
  getOrder: (orderId: string) => Promise<Order | null>;
  getOrders: () => Promise<void>;
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>) => Promise<Order | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  cancelOrder: (orderId: string) => Promise<boolean>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Mock API call to get user's orders
  const getOrders = useCallback(async () => {
    if (!isAuthenticated || !user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock data - in a real app, this would be an API call
      const mockOrders: OrderSummary[] = [
        {
          id: 'order-1',
          orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'delivered',
          total: 129.98,
          itemCount: 2,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: 'order-2',
          orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
          status: 'shipped',
          total: 89.99,
          itemCount: 1,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ];
      
      setOrders(mockOrders);
    } catch (err) {
      setError('Failed to fetch orders. Please try again.');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  // Get a single order by ID
  const getOrder = async (orderId: string): Promise<Order | null> => {
    if (!isAuthenticated || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data - in a real app, this would be an API call
      const mockOrder: Order = {
        id: orderId,
        userId: user.id,
        orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
        items: [
          {
            productId: 'prod-1',
            name: 'Premium Wireless Headphones',
            price: 129.99,
            quantity: 2,
            image: 'https://via.placeholder.com/150',
          },
        ],
        subtotal: 259.98,
        shipping: 0,
        tax: 25.99,
        total: 285.97,
        status: 'delivered',
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          address: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States',
          phone: '(555) 123-4567',
          email: 'john.doe@example.com',
        },
        paymentInfo: {
          method: 'credit',
          status: 'completed',
          cardLast4: '4242',
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
        trackingNumber: '1Z999AA1234567890',
        trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=1Z999AA1234567890',
      };
      
      return mockOrder;
    } catch (err) {
      setError('Failed to fetch order details. Please try again.');
      console.error('Error fetching order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order | null> => {
    if (!isAuthenticated || !user) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response - in a real app, this would be an API call
      const newOrder: Order = {
        ...orderData,
        id: `order-${Math.random().toString(36).substr(2, 9)}`,
        orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // Update local state
      setOrders(prev => [
        {
          id: newOrder.id,
          orderNumber: newOrder.orderNumber,
          status: newOrder.status,
          total: newOrder.total,
          itemCount: newOrder.items.reduce((sum, item) => sum + item.quantity, 0),
          createdAt: newOrder.createdAt,
          updatedAt: newOrder.updatedAt,
        },
        ...prev
      ]);
      
      return newOrder;
    } catch (err) {
      setError('Failed to create order. Please try again.');
      console.error('Error creating order:', err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Update order status
  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<boolean> => {
    if (!isAuthenticated) return false;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId 
            ? { ...order, status, updatedAt: new Date().toISOString() } 
            : order
        )
      );
      
      return true;
    } catch (err) {
      setError('Failed to update order status. Please try again.');
      console.error('Error updating order status:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Cancel an order
  const cancelOrder = async (orderId: string): Promise<boolean> => {
    return updateOrderStatus(orderId, 'cancelled');
  };

  // Load orders when component mounts or user changes
  useEffect(() => {
    getOrders();
  }, [getOrders]);

  return (
    <OrderContext.Provider
      value={{
        orders,
        loading,
        error,
        getOrder,
        getOrders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};

export default OrderContext;
