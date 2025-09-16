import React, { createContext, useContext, ReactNode } from 'react';

export interface Product {
  productId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  availabilityStatus: string;
  effectiveDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  features?: string[];
  image?: string;
  partnerId?: string;
}

interface Order {
  orderId: string;
  customerId: string;
  productId: string;
  orderDate: string;
  status: string;
  totalAmount: number;
  currency: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

interface Partner {
  partnerId: string;
  name: string;
  contactEmail: string;
  contactPhone: string;
  status: string;
  onboardingDate: string;
  createdAt: string;
  updatedAt: string;
}

interface Notification {
  notificationId: string;
  customerId: string;
  type: string;
  channel: string;
  message: string;
  sentAt: string;
  status: string;
  read: boolean;
}

interface DataContextType {
  products: Product[];
  orders: Order[];
  partners: Partner[];
  notifications: Notification[];
  categories: string[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const products: Product[] = [
    {
      productId: 'prod-001',
      name: 'Fiber Broadband 100Mbps',
      description: 'High-speed fiber broadband package with unlimited data and premium support',
      category: 'Broadband',
      price: 49.99,
      currency: 'USD',
      availabilityStatus: 'Available',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      rating: 4.5,
      features: ['100Mbps download speed', 'Unlimited data', '24/7 support', 'Free router'],
      image: 'https://images.pexels.com/photos/159304/network-cable-ethernet-computer-159304.jpeg?auto=compress&cs=tinysrgb&w=400',
      partnerId: 'partner-001'
    },
    {
      productId: 'prod-002',
      name: 'Unlimited Mobile Plan',
      description: 'Unlimited talk, text, and data with 5G coverage nationwide',
      category: 'Mobile',
      price: 29.99,
      currency: 'USD',
      availabilityStatus: 'Available',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      rating: 4.2,
      features: ['Unlimited talk & text', '5G network access', 'Mobile hotspot', 'International roaming'],
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
      partnerId: 'partner-002'
    },
    {
      productId: 'prod-003',
      name: 'Cloud Storage Pro',
      description: 'Secure cloud storage with 1TB space and advanced collaboration features',
      category: 'Digital',
      price: 9.99,
      currency: 'USD',
      availabilityStatus: 'Available',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      rating: 4.7,
      features: ['1TB storage space', 'End-to-end encryption', 'Team collaboration', 'Version control'],
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400',
      partnerId: 'partner-003'
    },
    {
      productId: 'prod-004',
      name: 'Business Internet Pro',
      description: 'Enterprise-grade internet solution with guaranteed uptime and priority support',
      category: 'Business',
      price: 199.99,
      currency: 'USD',
      availabilityStatus: 'Available',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      rating: 4.8,
      features: ['Guaranteed 99.9% uptime', 'Dedicated support', 'Static IP addresses', 'Advanced security'],
      image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=400',
      partnerId: 'partner-001'
    },
    {
      productId: 'prod-005',
      name: 'Streaming Bundle',
      description: 'Access to premium streaming services with 4K content and multiple devices',
      category: 'Digital',
      price: 19.99,
      currency: 'USD',
      availabilityStatus: 'Available',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      rating: 4.3,
      features: ['4K streaming', '5 simultaneous devices', 'Premium content', 'Ad-free experience'],
      image: 'https://images.pexels.com/photos/1181292/pexels-photo-1181292.jpeg?auto=compress&cs=tinysrgb&w=400',
      partnerId: 'partner-003'
    },
    {
      productId: 'prod-006',
      name: 'Smart Home Security',
      description: 'Complete home security system with smart cameras and 24/7 monitoring',
      category: 'Digital',
      price: 39.99,
      currency: 'USD',
      availabilityStatus: 'Available',
      effectiveDate: '2024-01-01T00:00:00Z',
      expirationDate: '2024-12-31T23:59:59Z',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z',
      rating: 4.6,
      features: ['Smart cameras', '24/7 monitoring', 'Mobile app control', 'Cloud storage'],
      image: 'https://images.pexels.com/photos/1730877/pexels-photo-1730877.jpeg?auto=compress&cs=tinysrgb&w=400',
      partnerId: 'partner-004'
    }
  ];

  const orders: Order[] = [
    {
      orderId: 'ord-001',
      customerId: 'cust-123',
      productId: 'prod-001',
      orderDate: '2024-01-15T10:30:00Z',
      status: 'Pending',
      totalAmount: 49.99,
      currency: 'USD',
      paymentStatus: 'Paid',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      orderId: 'ord-002',
      customerId: 'cust-123',
      productId: 'prod-002',
      orderDate: '2024-01-14T14:15:00Z',
      status: 'Fulfilled',
      totalAmount: 29.99,
      currency: 'USD',
      paymentStatus: 'Paid',
      createdAt: '2024-01-14T14:15:00Z',
      updatedAt: '2024-01-14T16:45:00Z'
    },
    {
      orderId: 'ord-003',
      customerId: 'cust-456',
      productId: 'prod-003',
      orderDate: '2024-01-13T09:45:00Z',
      status: 'Approved',
      totalAmount: 9.99,
      currency: 'USD',
      paymentStatus: 'Paid',
      createdAt: '2024-01-13T09:45:00Z',
      updatedAt: '2024-01-13T11:20:00Z'
    },
    {
      orderId: 'ord-004',
      customerId: 'cust-789',
      productId: 'prod-004',
      orderDate: '2024-01-12T16:20:00Z',
      status: 'Fulfilled',
      totalAmount: 199.99,
      currency: 'USD',
      paymentStatus: 'Paid',
      createdAt: '2024-01-12T16:20:00Z',
      updatedAt: '2024-01-12T18:30:00Z'
    },
    {
      orderId: 'ord-005',
      customerId: 'cust-123',
      productId: 'prod-005',
      orderDate: '2024-01-11T11:10:00Z',
      status: 'Cancelled',
      totalAmount: 19.99,
      currency: 'USD',
      paymentStatus: 'Refunded',
      createdAt: '2024-01-11T11:10:00Z',
      updatedAt: '2024-01-11T12:00:00Z'
    }
  ];

  const partners: Partner[] = [
    {
      partnerId: 'partner-001',
      name: 'TelcoCore Solutions',
      contactEmail: 'contact@telcocore.com',
      contactPhone: '+1-555-0101',
      status: 'Active',
      onboardingDate: '2023-12-01T00:00:00Z',
      createdAt: '2023-12-01T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      partnerId: 'partner-002',
      name: 'MobileFirst Networks',
      contactEmail: 'info@mobilefirst.com',
      contactPhone: '+1-555-0102',
      status: 'Active',
      onboardingDate: '2023-11-15T00:00:00Z',
      createdAt: '2023-11-15T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      partnerId: 'partner-003',
      name: 'CloudStream Services',
      contactEmail: 'support@cloudstream.com',
      contactPhone: '+1-555-0103',
      status: 'Active',
      onboardingDate: '2023-10-20T00:00:00Z',
      createdAt: '2023-10-20T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      partnerId: 'partner-004',
      name: 'SecureHome Tech',
      contactEmail: 'contact@securehome.com',
      contactPhone: '+1-555-0104',
      status: 'PendingApproval',
      onboardingDate: '2024-01-10T00:00:00Z',
      createdAt: '2024-01-10T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    },
    {
      partnerId: 'partner-005',
      name: 'Enterprise Connect',
      contactEmail: 'hello@enterpriseconnect.com',
      contactPhone: '+1-555-0105',
      status: 'PendingApproval',
      onboardingDate: '2024-01-12T00:00:00Z',
      createdAt: '2024-01-12T00:00:00Z',
      updatedAt: '2024-01-15T10:30:00Z'
    }
  ];

  const notifications: Notification[] = [
    {
      notificationId: 'notif-001',
      customerId: 'cust-123',
      type: 'OrderConfirmation',
      channel: 'Email',
      message: 'Your order #ORD-001 has been confirmed and is being processed.',
      sentAt: '2024-01-15T10:30:00Z',
      status: 'Sent',
      read: false
    },
    {
      notificationId: 'notif-002',
      customerId: 'cust-123',
      type: 'Promotion',
      channel: 'SMS',
      message: 'Special offer: 20% off on all mobile plans this week!',
      sentAt: '2024-01-14T14:15:00Z',
      status: 'Sent',
      read: false
    },
    {
      notificationId: 'notif-003',
      customerId: 'cust-123',
      type: 'Alert',
      channel: 'PushNotification',
      message: 'Your service activation is complete. Welcome to TelcoMarket!',
      sentAt: '2024-01-13T09:45:00Z',
      status: 'Sent',
      read: true
    },
    {
      notificationId: 'notif-004',
      customerId: 'cust-456',
      type: 'OrderConfirmation',
      channel: 'Email',
      message: 'Your order #ORD-003 has been approved and will be activated soon.',
      sentAt: '2024-01-13T11:20:00Z',
      status: 'Sent',
      read: false
    },
    {
      notificationId: 'notif-005',
      customerId: 'cust-789',
      type: 'Alert',
      channel: 'Email',
      message: 'Your business internet service is now active with guaranteed SLA.',
      sentAt: '2024-01-12T18:30:00Z',
      status: 'Sent',
      read: true
    }
  ];

  const categories = ['Mobile', 'Broadband', 'Digital', 'Business'];

  return (
    <DataContext.Provider value={{ products, orders, partners, notifications, categories }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};