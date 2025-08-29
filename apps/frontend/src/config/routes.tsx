import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load components for better performance
const ProductCatalog = lazy(() => import('@/components/products/ProductCatalog'));
const ProductDetail = lazy(() => import('@/components/products/ProductDetail'));
const CategoryManagement = lazy(() => import('@/components/categories/CategoryManagement'));
const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const OrderConfirmation = lazy(() => import('@/pages/OrderConfirmation'));
const OrderHistoryPage = lazy(() => import('@/pages/OrderHistoryPage'));
const OrderDetailPage = lazy(() => import('@/pages/OrderDetailPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));

// Protected route component
import ProtectedRoute from '@/components/auth/ProtectedRoute';

// Define route roles
export enum RouteRole {
  PUBLIC = 'PUBLIC',
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  PARTNER = 'PARTNER',
}

// Route configuration
export const routes: Array<RouteObject & { role?: RouteRole }> = [
  {
    path: '/',
    element: <HomePage />,
    role: RouteRole.PUBLIC,
  },
  {
    path: '/login',
    element: <LoginPage />,
    role: RouteRole.PUBLIC,
  },
  {
    path: '/catalog',
    element: <ProductCatalog />,
    role: RouteRole.PUBLIC,
  },
  {
    path: '/products/:id',
    element: <ProductDetail />,
    role: RouteRole.PUBLIC,
  },
  {
    path: '/cart',
    element: (
      <ProtectedRoute>
        <CartPage />
      </ProtectedRoute>
    ),
    role: RouteRole.CUSTOMER,
  },
  {
    path: '/checkout',
    element: (
      <ProtectedRoute>
        <CheckoutPage />
      </ProtectedRoute>
    ),
    role: RouteRole.CUSTOMER,
  },
  {
    path: '/order-confirmation/:orderId',
    element: (
      <ProtectedRoute>
        <OrderConfirmation />
      </ProtectedRoute>
    ),
    role: RouteRole.CUSTOMER,
  },
  {
    path: '/orders',
    element: (
      <ProtectedRoute>
        <OrderHistoryPage />
      </ProtectedRoute>
    ),
    role: RouteRole.CUSTOMER,
  },
  {
    path: '/orders/:orderId',
    element: (
      <ProtectedRoute>
        <OrderDetailPage />
      </ProtectedRoute>
    ),
    role: RouteRole.CUSTOMER,
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfilePage />
      </ProtectedRoute>
    ),
    role: RouteRole.CUSTOMER,
  },
  {
    path: '/admin/categories',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <CategoryManagement />
      </ProtectedRoute>
    ),
    role: RouteRole.ADMIN,
  },
  // TODO: Add more admin routes as needed
  {
    path: '*',
    element: <div>Not Found</div>,
    role: RouteRole.PUBLIC,
  },
];

// Helper function to get routes by role
export const getRoutesByRole = (role: string) => {
  return routes.filter(route => {
    if (!route.role || route.role === RouteRole.PUBLIC) return true;
    if (role === RouteRole.ADMIN) return true;
    if (role === RouteRole.PARTNER && route.role !== RouteRole.ADMIN) return true;
    return route.role === role;
  });
};

export default routes;
