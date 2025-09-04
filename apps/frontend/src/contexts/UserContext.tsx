import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { 
  UserProfile, 
  UserAddress, 
  PaymentMethod, 
  UpdateProfileData, 
  UpdatePasswordData, 
  UpdateNotificationPreferencesData,
  AddAddressData,
  UpdateAddressData,
  AddPaymentMethodData
} from '../types/user';

interface UserContextType {
  // User Profile
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  updatePassword: (data: UpdatePasswordData) => Promise<boolean>;
  updateAvatar: (file: File) => Promise<boolean>;
  updateNotificationPreferences: (data: UpdateNotificationPreferencesData) => Promise<boolean>;
  
  // Addresses
  addresses: UserAddress[];
  loadingAddresses: boolean;
  addAddress: (data: AddAddressData) => Promise<boolean>;
  updateAddress: (data: UpdateAddressData) => Promise<boolean>;
  deleteAddress: (addressId: string) => Promise<boolean>;
  setDefaultAddress: (addressId: string) => Promise<boolean>;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  loadingPaymentMethods: boolean;
  addPaymentMethod: (data: AddPaymentMethodData) => Promise<boolean>;
  deletePaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  setDefaultPaymentMethod: (paymentMethodId: string) => Promise<boolean>;
  
  // Refresh data
  refreshProfile: () => Promise<void>;
  refreshAddresses: () => Promise<void>;
  refreshPaymentMethods: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for development
const mockProfile: UserProfile = {
  id: 'user-123',
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe',
  phone: '+1 (555) 123-4567',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  dateOfBirth: '1990-01-01',
  gender: 'male',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
  preferredLanguage: 'en-US',
  preferredCurrency: 'USD',
  notificationPreferences: {
    email: {
      orderUpdates: true,
      promotions: true,
      newsletter: true,
      accountActivity: true,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      accountActivity: true,
    },
    sms: {
      orderUpdates: true,
      promotions: false,
      accountActivity: false,
    },
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockAddresses: UserAddress[] = [
  {
    id: 'addr-1',
    fullName: 'John Doe',
    phone: '+1 (555) 123-4567',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    isDefault: true,
    addressType: 'home',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'addr-2',
    fullName: 'John Doe',
    phone: '+1 (555) 123-4567',
    addressLine1: '456 Work Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10002',
    country: 'United States',
    isDefault: false,
    addressType: 'work',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: 'pm-1',
    cardType: 'visa',
    last4: '4242',
    expiryMonth: 12,
    expiryYear: 2025,
    isDefault: true,
    billingAddress: {
      id: 'billing-1',
      fullName: 'John Doe',
      phone: '+1 (555) 123-4567',
      addressLine1: '123 Main St',
      addressLine2: 'Apt 4B',
      city: 'New York',
      state: 'NY',
      postalCode: '10001',
      country: 'United States',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, updateUser } = useAuth();
  
  // Profile state
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Addresses state
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState<boolean>(true);
  
  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState<boolean>(true);

  // Load user profile
  const loadProfile = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call to get the user's profile
      setProfile(mockProfile);
    } catch (err) {
      setError('Failed to load profile. Please try again.');
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Load user addresses
  const loadAddresses = useCallback(async () => {
    if (!user) return;
    
    setLoadingAddresses(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call to get the user's addresses
      setAddresses(mockAddresses);
    } catch (err) {
      console.error('Error loading addresses:', err);
    } finally {
      setLoadingAddresses(false);
    }
  }, [user]);

  // Load payment methods
  const loadPaymentMethods = useCallback(async () => {
    if (!user) return;
    
    setLoadingPaymentMethods(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would be an API call to get the user's payment methods
      setPaymentMethods(mockPaymentMethods);
    } catch (err) {
      console.error('Error loading payment methods:', err);
    } finally {
      setLoadingPaymentMethods(false);
    }
  }, [user]);

  // Update profile
  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would be an API call to update the user's profile
      const updatedProfile = {
        ...mockProfile,
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      setProfile(updatedProfile);
      
      // Update the user in auth context if name was changed
      if (data.firstName || data.lastName) {
        updateUser({
          ...user,
          name: `${data.firstName || profile?.firstName} ${data.lastName || profile?.lastName}`.trim(),
        });
      }
      
      return true;
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update password
  const updatePassword = async (data: UpdatePasswordData): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would validate the current password and update it
      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error('New passwords do not match');
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update password. Please try again.');
      console.error('Error updating password:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update avatar
  const updateAvatar = async (file: File): Promise<boolean> => {
    if (!user) return false;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, this would upload the file and return the URL
      const avatarUrl = URL.createObjectURL(file);
      
      const updatedProfile = {
        ...mockProfile,
        avatar: avatarUrl,
        updatedAt: new Date().toISOString(),
      };
      
      setProfile(updatedProfile);
      
      return true;
    } catch (err) {
      setError('Failed to update avatar. Please try again.');
      console.error('Error updating avatar:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update notification preferences
  const updateNotificationPreferences = async (
    data: UpdateNotificationPreferencesData
  ): Promise<boolean> => {
    if (!user || !profile) return false;
    
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would update the notification preferences
      const updatedProfile = {
        ...profile,
        notificationPreferences: {
          ...profile.notificationPreferences,
          ...(data.email && { email: { ...profile.notificationPreferences.email, ...data.email } }),
          ...(data.push && { push: { ...profile.notificationPreferences.push, ...data.push } }),
          ...(data.sms && { sms: { ...profile.notificationPreferences.sms, ...data.sms } }),
        },
        updatedAt: new Date().toISOString(),
      };
      
      setProfile(updatedProfile);
      
      return true;
    } catch (err) {
      setError('Failed to update notification preferences. Please try again.');
      console.error('Error updating notification preferences:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Add address
  const addAddress = async (data: AddAddressData): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingAddresses(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would create a new address
      const newAddress: UserAddress = {
        id: `addr-${Date.now()}`,
        ...data,
        isDefault: data.isDefault || false,
        addressType: data.addressType || 'home',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // If this is set as default, update other addresses
      if (data.isDefault) {
        setAddresses(prev => 
          prev.map(addr => ({
            ...addr,
            isDefault: false,
          }))
          .concat(newAddress)
        );
      } else {
        setAddresses(prev => [...prev, newAddress]);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding address:', err);
      return false;
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Update address
  const updateAddress = async (data: UpdateAddressData): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingAddresses(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // In a real app, this would update the address
      setAddresses(prev => 
        prev.map(addr => 
          addr.id === data.id
            ? {
                ...addr,
                ...data,
                updatedAt: new Date().toISOString(),
              }
            : data.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
      
      return true;
    } catch (err) {
      console.error('Error updating address:', err);
      return false;
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Delete address
  const deleteAddress = async (addressId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingAddresses(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would delete the address
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      
      return true;
    } catch (err) {
      console.error('Error deleting address:', err);
      return false;
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Set default address
  const setDefaultAddress = async (addressId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingAddresses(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would set the default address
      setAddresses(prev => 
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === addressId,
        }))
      );
      
      return true;
    } catch (err) {
      console.error('Error setting default address:', err);
      return false;
    } finally {
      setLoadingAddresses(false);
    }
  };

  // Add payment method
  const addPaymentMethod = async (data: AddPaymentMethodData): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingPaymentMethods(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract last 4 digits from card number
      const last4 = data.cardNumber.slice(-4);
      
      // In a real app, this would create a new payment method
      const newPaymentMethod: PaymentMethod = {
        id: `pm-${Date.now()}`,
        cardType: 'visa', // This would be determined from the card number in a real app
        last4,
        expiryMonth: data.expiryMonth,
        expiryYear: data.expiryYear,
        isDefault: data.isDefault || false,
        billingAddress: {
          id: `billing-${Date.now()}`,
          ...data.billingAddress,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      // If this is set as default, update other payment methods
      if (data.isDefault) {
        setPaymentMethods(prev => 
          prev.map(pm => ({
            ...pm,
            isDefault: false,
          }))
          .concat(newPaymentMethod)
        );
      } else {
        setPaymentMethods(prev => [...prev, newPaymentMethod]);
      }
      
      return true;
    } catch (err) {
      console.error('Error adding payment method:', err);
      return false;
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  // Delete payment method
  const deletePaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingPaymentMethods(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would delete the payment method
      setPaymentMethods(prev => prev.filter(pm => pm.id !== paymentMethodId));
      
      return true;
    } catch (err) {
      console.error('Error deleting payment method:', err);
      return false;
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  // Set default payment method
  const setDefaultPaymentMethod = async (paymentMethodId: string): Promise<boolean> => {
    if (!user) return false;
    
    setLoadingPaymentMethods(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, this would set the default payment method
      setPaymentMethods(prev => 
        prev.map(pm => ({
          ...pm,
          isDefault: pm.id === paymentMethodId,
        }))
      );
      
      return true;
    } catch (err) {
      console.error('Error setting default payment method:', err);
      return false;
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  // Load data when component mounts or user changes
  useEffect(() => {
    if (user) {
      loadProfile();
      loadAddresses();
      loadPaymentMethods();
    } else {
      setProfile(null);
      setAddresses([]);
      setPaymentMethods([]);
    }
  }, [user, loadProfile, loadAddresses, loadPaymentMethods]);

  return (
    <UserContext.Provider
      value={{
        // Profile
        profile,
        loading,
        error,
        updateProfile,
        updatePassword,
        updateAvatar,
        updateNotificationPreferences,
        
        // Addresses
        addresses,
        loadingAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        
        // Payment Methods
        paymentMethods,
        loadingPaymentMethods,
        addPaymentMethod,
        deletePaymentMethod,
        setDefaultPaymentMethod,
        
        // Refresh functions
        refreshProfile: loadProfile,
        refreshAddresses: loadAddresses,
        refreshPaymentMethods: loadPaymentMethods,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;
