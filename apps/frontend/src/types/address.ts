export type AddressType = 'shipping' | 'billing';

export interface Address {
  id: string;
  type: AddressType;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressFormData extends Omit<Address, 'id' | 'createdAt' | 'updatedAt' | 'isDefault'> {
  isDefault?: boolean;
}

export interface AddressValidationSchema {
  fullName: string;
  phone: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
