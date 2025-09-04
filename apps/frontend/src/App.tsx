import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { ProductCatalog } from './pages/ProductCatalog';
import ProductDetail from './pages/ProductDetail';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { PartnerDashboard } from './pages/PartnerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrderTracking } from './pages/OrderTracking';
import { ProfilePage } from './pages/ProfilePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { HelpCenterPage } from './pages/HelpCenterPage';
import { ContactPage } from './pages/ContactPage';
import { ReturnsPage } from './pages/ReturnsPage';
import { PartnerPortalPage } from './pages/PartnerPortalPage';
import { PartnerOnboardingPage } from './pages/PartnerOnboardingPage';
import { DeveloperPage } from './pages/DeveloperPage';
import { TMForumPage } from './pages/TMForumPage';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import { UserProvider } from './contexts/UserContext';
import { ToastProvider } from './contexts/ToastContext';
import OrderHistoryPage from './pages/OrderHistoryPage';
import OrderDetailPage from './pages/OrderDetailPage';
import LoginPage from './pages/LoginPage';
import { useAuth } from './contexts/AuthContext';
import  RegisterPage from './pages/RegisterPage';
import GoogleSuccess from "./pages/GoogleSuccess.tsx";
import CompleteSignup from './pages/CompleteSignUp.tsx';
import GoogleCallback from "./pages/GoogleCallback.tsx";


// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// ThemedApp component that uses the theme
function ThemedApp() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen bg-background text-foreground flex flex-col transition-colors duration-200 ${theme}`}>
      <Header />
      <main className="flex-1 bg-background">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/partner" element={<PartnerDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/google/success" element={<GoogleSuccess />} />
          <Route path="/complete-signup" element={<CompleteSignup />} />
          <Route path="/google-callback" element={<GoogleCallback />} />


          <Route 
            path="/orders" 
            element={
              <ProtectedRoute>
                <OrderHistoryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/orders/:orderId" 
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            } 
          />
          <Route path="/track-order" element={<OrderTracking />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          
          {/* Support Pages */}
          <Route path="/help" element={<HelpCenterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/returns" element={<ReturnsPage />} />
          
          {/* Partner Pages */}
          <Route path="/partner" element={<PartnerPortalPage />} />
          <Route path="/partner/onboarding" element={<PartnerOnboardingPage />} />
          <Route path="/developer" element={<DeveloperPage />} />
          <Route path="/tm-forum" element={<TMForumPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

// Main App component that sets up all providers
function App() {
  console.log('App component mounting...');
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <DataProvider>
              <CartProvider>
                <OrderProvider>
                  <UserProvider>
                    <Router>
                      <ThemedApp />
                    </Router>
                  </UserProvider>
                </OrderProvider>
              </CartProvider>
            </DataProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;