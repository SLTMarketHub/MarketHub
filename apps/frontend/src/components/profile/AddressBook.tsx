import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Home, 
  BuildingOffice, 
  MapPin, 
  Phone, 
  User, 
  Check, 
  X, 
  Plus, 
  Pencil, 
  Trash2,
  MapPin as MapPinIcon,
  Truck,
  CreditCard,
  Save,
  Loader2
} from 'lucide-react';
import { Address, AddressType, AddressFormData } from '../../types/address';

// Form validation schema
const addressSchema = z.object({
  type: z.enum(['shipping', 'billing']),
  fullName: z.string().min(1, 'Full name is required'),
  phone: z.string().min(10, 'A valid phone number is required'),
  addressLine1: z.string().min(1, 'Address line 1 is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State/Province is required'),
  postalCode: z.string().min(3, 'Postal code is required'),
  country: z.string().min(1, 'Country is required'),
  isDefault: z.boolean().optional(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressBookProps {
  onSuccess: (message: string) => void;
  onError: (message: string) => void;
}

// Mock data - in a real app, this would come from an API
const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'shipping',
    fullName: 'John Doe',
    phone: '+1 (555) 123-4567',
    addressLine1: '123 Main St',
    addressLine2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    isDefault: true,
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
  },
  {
    id: '2',
    type: 'billing',
    fullName: 'John Doe',
    phone: '+1 (555) 123-4567',
    addressLine1: '456 Billing Ave',
    city: 'New York',
    state: 'NY',
    postalCode: '10001',
    country: 'United States',
    isDefault: true,
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
  },
];

const AddressBook: React.FC<AddressBookProps> = ({ onSuccess, onError }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [addressType, setAddressType] = useState<AddressType>('shipping');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with react-hook-form
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      type: 'shipping',
      isDefault: false,
    },
  });

  // Fetch addresses (mock implementation)
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        setAddresses(mockAddresses);
      } catch (error) {
        onError('Failed to load addresses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAddresses();
  }, [onError]);

  // Reset form when editing or changing address type
  useEffect(() => {
    if (editingId) {
      const address = addresses.find(addr => addr.id === editingId);
      if (address) {
        Object.entries(address).forEach(([key, value]) => {
          setValue(key as keyof AddressFormValues, value as any);
        });
      }
    } else {
      reset({
        type: addressType,
        isDefault: false,
      });
    }
  }, [editingId, addresses, addressType, setValue, reset]);

  // Handle form submission (add or update address)
  const onSubmit = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (editingId) {
        // Update existing address
        setAddresses(prev =>
          prev.map(addr =>
            addr.id === editingId
              ? { ...addr, ...data, updatedAt: new Date().toISOString() }
              : data.isDefault && addr.type === data.type
              ? { ...addr, isDefault: false }
              : addr
          )
        );
        onSuccess('Address updated successfully');
      } else {
        // Add new address
        const newAddress: Address = {
          ...data,
          id: Date.now().toString(),
          isDefault: data.isDefault || false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setAddresses(prev => [
          ...prev.map(addr =>
            data.isDefault && addr.type === data.type
              ? { ...addr, isDefault: false }
              : addr
          ),
          newAddress,
        ]);
        onSuccess('Address added successfully');
      }
      
      // Reset form and close
      resetForm();
    } catch (error) {
      onError('Failed to save address. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle delete address
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setAddresses(prev => prev.filter(addr => addr.id !== id));
        onSuccess('Address deleted successfully');
      } catch (error) {
        onError('Failed to delete address. Please try again.');
      }
    }
  };

  // Set address as default
  const setAsDefault = async (id: string, type: AddressType) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          isDefault: addr.id === id || (addr.type !== type && addr.isDefault),
        }))
      );
      onSuccess('Default address updated');
    } catch (error) {
      onError('Failed to update default address. Please try again.');
    }
  };

  // Reset form to initial state
  const resetForm = () => {
    reset({
      type: addressType,
      isDefault: false,
    });
    setEditingId(null);
    setIsFormOpen(false);
  };

  // Open form for adding a new address
  const openAddForm = (type: AddressType) => {
    setAddressType(type);
    setEditingId(null);
    setIsFormOpen(true);
    reset({
      type,
      isDefault: false,
    });
  };

  // Open form for editing an existing address
  const openEditForm = (id: string) => {
    const address = addresses.find(addr => addr.id === id);
    if (address) {
      setAddressType(address.type);
      setEditingId(id);
      setIsFormOpen(true);
    }
  };

  // Group addresses by type
  const shippingAddresses = addresses.filter(addr => addr.type === 'shipping');
  const billingAddresses = addresses.filter(addr => addr.type === 'billing');

  // Render address card
  const renderAddressCard = (address: Address) => (
    <div
      key={address.id}
      className={`border rounded-lg p-4 ${
        address.isDefault ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center mb-2">
          {address.type === 'shipping' ? (
            <Truck className="h-5 w-5 text-gray-500 mr-2" />
          ) : (
            <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
          )}
          <h4 className="font-medium text-gray-900 capitalize">
            {address.type} {address.isDefault && '(Default)'}
          </h4>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => openEditForm(address.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleDelete(address.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-700">
        <p className="font-medium">{address.fullName}</p>
        <p>{address.addressLine1}</p>
        {address.addressLine2 && <p>{address.addressLine2}</p>}
        <p>
          {address.city}, {address.state} {address.postalCode}
        </p>
        <p>{address.country}</p>
        <p className="mt-2 flex items-center">
          <Phone className="h-4 w-4 mr-1 text-gray-500" />
          {address.phone}
        </p>
      </div>
      
      {!address.isDefault && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setAsDefault(address.id, address.type)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Set as default {address.type} address
          </button>
        </div>
      )}
    </div>
  );

  // Render empty state
  const renderEmptyState = (type: AddressType) => (
    <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
      <MapPinIcon className="mx-auto h-12 w-12 text-gray-400" />
      <h3 className="mt-2 text-sm font-medium text-gray-900">No {type} addresses</h3>
      <p className="mt-1 text-sm text-gray-500">
        You haven't added any {type} addresses yet.
      </p>
      <div className="mt-6">
        <button
          type="button"
          onClick={() => openAddForm(type)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Add {type} address
        </button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Shipping Addresses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Shipping Addresses</h3>
          <button
            type="button"
            onClick={() => openAddForm('shipping')}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
            Add Shipping
          </button>
        </div>
        
        {shippingAddresses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {shippingAddresses.map(renderAddressCard)}
          </div>
        ) : (
          renderEmptyState('shipping')
        )}
      </div>
      
      {/* Billing Addresses */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Billing Addresses</h3>
          <button
            type="button"
            onClick={() => openAddForm('billing')}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="-ml-0.5 mr-1.5 h-4 w-4" />
            Add Billing
          </button>
        </div>
        
        {billingAddresses.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {billingAddresses.map(renderAddressCard)}
          </div>
        ) : (
          renderEmptyState('billing')
        )}
      </div>
      
      {/* Address Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingId ? 'Edit Address' : 'Add New Address'}
                </h3>
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Address Type Toggle */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address Type
                  </label>
                  <div className="flex rounded-md shadow-sm">
                    <button
                      type="button"
                      onClick={() => setValue('type', 'shipping')}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-l-md border ${
                        addressType === 'shipping'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Truck className="inline-block h-4 w-4 mr-2" />
                      Shipping
                    </button>
                    <button
                      type="button"
                      onClick={() => setValue('type', 'billing')}
                      className={`flex-1 py-2 px-4 text-sm font-medium rounded-r-md border ${
                        addressType === 'billing'
                          ? 'bg-blue-50 border-blue-500 text-blue-700'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <CreditCard className="inline-block h-4 w-4 mr-2" />
                      Billing
                    </button>
                  </div>
                  <input type="hidden" {...register('type')} />
                </div>
                
                {/* Full Name */}
                <div className="sm:col-span-6">
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="fullName"
                      {...register('fullName')}
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.fullName ? 'border-red-300' : ''
                      }`}
                      placeholder="John Doe"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
                  )}
                </div>
                
                {/* Phone */}
                <div className="sm:col-span-6">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      {...register('phone')}
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.phone ? 'border-red-300' : ''
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                  )}
                </div>
                
                {/* Address Line 1 */}
                <div className="sm:col-span-6">
                  <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                    Address Line 1
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      id="addressLine1"
                      {...register('addressLine1')}
                      className={`block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.addressLine1 ? 'border-red-300' : ''
                      }`}
                      placeholder="123 Main St"
                    />
                  </div>
                  {errors.addressLine1 && (
                    <p className="mt-1 text-sm text-red-600">{errors.addressLine1.message}</p>
                  )}
                </div>
                
                {/* Address Line 2 */}
                <div className="sm:col-span-6">
                  <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                    Address Line 2 (Optional)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-400 opacity-0" />
                    </div>
                    <input
                      type="text"
                      id="addressLine2"
                      {...register('addressLine2')}
                      className="block w-full pl-10 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Apt, suite, etc. (optional)"
                    />
                  </div>
                </div>
                
                {/* City */}
                <div className="sm:col-span-2">
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    City
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="city"
                      {...register('city')}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.city ? 'border-red-300' : ''
                      }`}
                      placeholder="New York"
                    />
                  </div>
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>
                  )}
                </div>
                
                {/* State/Province */}
                <div className="sm:col-span-2">
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                    State / Province
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="state"
                      {...register('state')}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.state ? 'border-red-300' : ''
                      }`}
                      placeholder="NY"
                    />
                  </div>
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state.message}</p>
                  )}
                </div>
                
                {/* Postal Code */}
                <div className="sm:col-span-2">
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                    ZIP / Postal Code
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="postalCode"
                      {...register('postalCode')}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.postalCode ? 'border-red-300' : ''
                      }`}
                      placeholder="10001"
                    />
                  </div>
                  {errors.postalCode && (
                    <p className="mt-1 text-sm text-red-600">{errors.postalCode.message}</p>
                  )}
                </div>
                
                {/* Country */}
                <div className="sm:col-span-6">
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                    Country
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      {...register('country')}
                      className={`block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                        errors.country ? 'border-red-300' : ''
                      }`}
                      defaultValue=""
                    >
                      <option value="" disabled>Select a country</option>
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                      <option value="France">France</option>
                      <option value="Japan">Japan</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-600">{errors.country.message}</p>
                  )}
                </div>
                
                {/* Set as default */}
                <div className="sm:col-span-6">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="isDefault"
                        type="checkbox"
                        {...register('isDefault')}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="isDefault" className="font-medium text-gray-700">
                        Set as default {addressType} address
                      </label>
                      <p className="text-gray-500">
                        This will be your default {addressType} address for future orders.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-5">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                      isSubmitting
                        ? 'bg-blue-400'
                        : 'bg-blue-600 hover:bg-blue-700'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="-ml-1 mr-2 h-4 w-4" />
                        {editingId ? 'Update Address' : 'Add Address'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressBook;
