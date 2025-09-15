export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  addressType: 'home' | 'work' | 'other';
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethod {
  id: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  last4: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
  billingAddress: Omit<UserAddress, 'isDefault' | 'addressType'>;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  preferredLanguage: string;
  preferredCurrency: string;
  notificationPreferences: {
    email: {
      orderUpdates: boolean;
      promotions: boolean;
      newsletter: boolean;
      accountActivity: boolean;
    };
    push: {
      orderUpdates: boolean;
      promotions: boolean;
      accountActivity: boolean;
    };
    sms: {
      orderUpdates: boolean;
      promotions: boolean;
      accountActivity: boolean;
    };
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  preferredLanguage?: string;
  preferredCurrency?: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface UpdateNotificationPreferencesData {
  email?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    newsletter?: boolean;
    accountActivity?: boolean;
  };
  push?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    accountActivity?: boolean;
  };
  sms?: {
    orderUpdates?: boolean;
    promotions?: boolean;
    accountActivity?: boolean;
  };
}

export interface AddAddressData {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  addressType?: 'home' | 'work' | 'other';
}

export interface UpdateAddressData extends Partial<AddAddressData> {
  id: string;
}

export interface AddPaymentMethodData {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  isDefault?: boolean;
  billingAddress: Omit<AddAddressData, 'isDefault' | 'addressType'>;
}
