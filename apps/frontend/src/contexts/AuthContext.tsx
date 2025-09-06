import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect
} from 'react';
import { useToast } from './ToastContext';
import { GoogleOAuthProvider, googleLogout } from '@react-oauth/google';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'partner' | 'admin';
  avatar?: string;
  authProvider?: 'google' | 'email';
  token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  loginWithGoogle: (credential: string) => Promise<User>; // kept for compatibility (not used in redirect flow)
  logout: () => void;
  isAuthenticated: boolean;
  updateUser: (userData: Partial<User>) => User | null;
  isGoogleLoading: boolean;
  setAuthUser: (userData: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const setAuthUser = useCallback((userData: User | null) => {
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      if (userData.token) localStorage.setItem('token', userData.token);
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
    setUser(userData);
  }, []);

  useEffect(() => {
    const loadUserFromStorage = () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };
    loadUserFromStorage();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') loadUserFromStorage();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // EMAIL/PASSWORD LOGIN -> backend
  const login = useCallback(async (email: string, password: string) => {
    const loadingToast = toast({
      title: 'Signing in...',
      description: 'Please wait while we sign you in',
      type: 'info',
      duration: 0
    });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Login failed');

      const mappedRole: User['role'] =
          (data?.user?.role || 'customer').toString().toLowerCase();

      const newUser: User = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: mappedRole,
        authProvider: 'email',
        token: data.token
      };

      setAuthUser(newUser);

      toast({
        title: 'Welcome back!',
        description: `Successfully logged in as ${newUser.email}`,
        type: 'success',
        duration: 3000
      });

      return newUser;
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error?.message || 'Invalid email or password.',
        type: 'error',
        duration: 4000
      });
      throw error;
    } finally {
      loadingToast.dismiss();
    }
  }, [toast, setAuthUser]);

  // Kept for compatibility (token flow), not used for redirect OAuth in this app
  const loginWithGoogle = useCallback(async (credential: string) => {
    setIsGoogleLoading(true);
    try {
      const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${credential}` },
      });
      const googleUser = await res.json();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: googleUser.name,
          email: googleUser.email,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      const mappedRole: User['role'] =
          (data?.user?.role || 'customer').toString().toLowerCase();

      const newUser: User = {
        id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        role: mappedRole,
        avatar: googleUser.picture,
        authProvider: 'google',
        token: data.token
      };

      setAuthUser(newUser);

      toast({
        title: 'Welcome!',
        description: `Signed in as ${newUser.name}`,
        type: 'success',
      });

      return newUser;
    } catch (err: any) {
      toast({
        title: 'Google login failed',
        description: err.message,
        type: 'error',
      });
      throw err;
    } finally {
      setIsGoogleLoading(false);
    }
  }, [toast, setAuthUser]);

  const logout = useCallback(() => {
    if (user?.authProvider === 'google') {
      googleLogout();
    }
    setAuthUser(null);
  }, [user, setAuthUser]);

  const updateUser = useCallback((userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setAuthUser(updatedUser);
      return updatedUser;
    }
    return null;
  }, [user, setAuthUser]);

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
              isGoogleLoading,
              setAuthUser
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
