import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { useToast } from './ToastContext';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'partner' | 'admin';
  avatar?: string;
  authProvider?: 'google' | 'email';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => void;
  loginWithGoogle: (credential: string) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => void;
  isGoogleLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    // Check for saved session in localStorage
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Load user from localStorage on initial render and listen for storage events
  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
        } catch (error) {
          console.error('Failed to parse user from localStorage', error);
          localStorage.removeItem('user');
        }
      } else {
        setUser(null);
      }
    };

    // Load user on initial render
    loadUserFromStorage();

    // Listen for storage events (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        loadUserFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      // Show loading state
      const loadingToast = toast({
        title: 'Signing in...',
        description: 'Please wait while we sign you in',
        type: 'info',
        duration: 0
      });
      
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const newUser = {
        id: 'user-' + Math.random().toString(36).substr(2, 9),
        name: email.split('@')[0],
        email,
        role: 'customer' as const
      };
      
      setUser(newUser);
      
      // Dismiss loading toast
      loadingToast.dismiss();
      
      // Show success message
      toast({
        title: 'Welcome back!',
        description: `Successfully logged in as ${newUser.email}`,
        type: 'success',
        duration: 3000
      });
      
      return newUser;
    } catch (error) {
      console.error('Login failed:', error);
      
      // Show error message
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        type: 'error',
        duration: 4000
      });
      
      throw error;
    }
  }, [toast]);

  const loginWithGoogle = useCallback(async (credential: string) => {
    setIsGoogleLoading(true);
    try {
      // In a real app, you would verify the credential with your backend
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { 'Authorization': `Bearer ${credential}` }
      });
      
      if (!response.ok) throw new Error('Google authentication failed');
      
      const googleUser = await response.json();
      
      const newUser: User = {
        id: `google-${googleUser.sub}`,
        name: googleUser.name,
        email: googleUser.email,
        role: 'customer', // Default role
        avatar: googleUser.picture,
        authProvider: 'google'
      };
      
      setUser(newUser);
      toast({
        title: 'Welcome!',
        description: `Signed in as ${googleUser.name}`,
        type: 'success'
      });
      
      return newUser;
    } catch (error) {
      console.error('Google login failed:', error);
      toast({
        title: 'Login failed',
        description: 'Failed to sign in with Google. Please try again.',
        type: 'error'
      });
      throw error;
    } finally {
      setIsGoogleLoading(false);
    }
  }, [toast]);

  const logout = useCallback(() => {
    // If user logged in with Google, sign them out of Google as well
    if (user?.authProvider === 'google') {
      googleLogout();
    }
    setUser(null);
    localStorage.removeItem('user');
  }, [user]);

  const isAuthenticated = !!user;

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      toast({
        title: 'Profile updated',
        description: 'Your profile information has been updated successfully',
        type: 'success',
        duration: 3000
      });
      
      return updatedUser;
    }
    return null;
  }, [user, toast]);

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <AuthContext.Provider 
        value={{ 
          user, 
          login, 
          loginWithGoogle,
          logout, 
          isAuthenticated: !!user, 
          updateUser,
          isGoogleLoading
        }}
      >
        {children}
      </AuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};