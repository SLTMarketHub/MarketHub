export type CardBrand = 'visa' | 'mastercard' | 'amex' | 'discover' | 'jcb' | 'diners' | 'unionpay' | 'unknown';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_account' | 'apple_pay' | 'google_pay';
  card?: {
    brand: CardBrand;
    last4: string;
    expMonth: number;
    expYear: number;
    name: string;
  };
  paypal?: {
    email: string;
  };
  bankAccount?: {
    bankName: string;
    last4: string;
    accountHolderName: string;
    accountHolderType: 'individual' | 'company';
  };
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentMethodFormData {
  type: 'card' | 'paypal' | 'bank_account';
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
  paypalEmail?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankAccountHolderName?: string;
  bankAccountHolderType?: 'individual' | 'company';
  isDefault: boolean;
}

export interface PaymentMethodValidationSchema {
  type: string;
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
  cardName?: string;
  paypalEmail?: string;
  bankAccountNumber?: string;
  bankRoutingNumber?: string;
  bankAccountHolderName?: string;
  bankAccountHolderType?: string;
}
