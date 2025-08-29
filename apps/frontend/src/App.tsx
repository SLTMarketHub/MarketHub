import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useRoutes } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { UserProvider } from './contexts/UserContext';
import { ToastProvider } from './contexts/ToastContext';
import { ProductCatalogProvider } from './contexts/ProductCatalogContext';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import routes from './config/routes';

// Lazy load layout components
const MainLayout = lazy(() => import('@/layouts/MainLayout'));
const AuthLayout = lazy(() => import('@/layouts/AuthLayout'));

// Loading component for Suspense fallback
const LoadingScreen = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
    width="100%"
  >
    <CircularProgress />
  </Box>
);

// Main App component that renders the routes
const AppContent = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const routing = useRoutes(routes);

  // Show loading screen while checking authentication
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Determine which layout to use based on the current route
  const Layout = isAuthenticated ? MainLayout : AuthLayout;

  return (
    <Suspense fallback={<LoadingScreen />}>
      <CssBaseline />
      <Layout>
        {routing}
      </Layout>
    </Suspense>
  );
};

// Main App component that sets up all providers
const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <UserProvider>
            <NotificationProvider>
              <DataProvider>
                <ProductCatalogProvider>
                  <CartProvider>
                    <OrderProvider>
                      <Router>
                        <AppContent />
                      </Router>
                    </OrderProvider>
                  </CartProvider>
                </ProductCatalogProvider>
              </DataProvider>
            </NotificationProvider>
          </UserProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;