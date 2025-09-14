export interface Product {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  rating?: number;
  reviewCount?: number;
  stock?: number;
  tags?: string[];
  specifications?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem extends Omit<Product, 'description' | 'category'> {
  quantity: number;
  selectedPlan?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedPlan?: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  type?: 'shipping' | 'billing';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  phone?: string;
  addresses?: Address[];
  paymentMethods?: PaymentMethod[];
  preferences?: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'paypal' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  currency: string;
  language: string;
  marketingEmails: boolean;
  orderNotifications: boolean;
  stockNotifications: boolean;
}
