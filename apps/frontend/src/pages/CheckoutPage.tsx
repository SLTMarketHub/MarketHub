import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormValidation } from '../hooks/useFormValidation';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Check, CreditCard, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  paymentMethod: 'credit' | 'paypal' | 'bank';
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  saveInfo: boolean;
  terms: boolean;
}

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const { values, errors, handleChange, handleSubmit } = useFormValidation<CheckoutFormData>(
    {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ')[1] || '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
      paymentMethod: 'credit',
      cardNumber: '',
      cardExpiry: '',
      cardCvc: '',
      saveInfo: true,
      terms: false,
    },
    {
      firstName: { required: true, message: 'First name is required' },
      lastName: { required: true, message: 'Last name is required' },
      email: { 
        required: true, 
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      phone: { 
        required: true, 
        pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
        message: 'Please enter a valid phone number'
      },
      address: { required: true, message: 'Address is required' },
      city: { required: true, message: 'City is required' },
      state: { required: true, message: 'State is required' },
      zipCode: { 
        required: true, 
        pattern: /^[0-9]{5}(-[0-9]{4})?$/,
        message: 'Please enter a valid ZIP code'
      },
      paymentMethod: { required: true },
      cardNumber: {
        required: true,
        custom: (value, values) => 
          values.paymentMethod !== 'credit' || /^[0-9\s]{13,19}$/.test(value) 
            ? true 
            : 'Please enter a valid card number'
      },
      cardExpiry: {
        required: true,
        custom: (value, values) => 
          values.paymentMethod !== 'credit' || /^(0[1-9]|1[0-2])\/[0-9]{2}$/.test(value)
            ? true
            : 'Please enter a valid expiry date (MM/YY)'
      },
      cardCvc: {
        required: true,
        custom: (value, values) => 
          values.paymentMethod !== 'credit' || /^[0-9]{3,4}$/.test(value)
            ? true
            : 'Please enter a valid CVC'
      },
      terms: {
        custom: (value) => value ? true : 'You must accept the terms and conditions'
      }
    }
  );

  const handleFormSubmit = async (formData: CheckoutFormData) => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
      return;
    }

    // Show loading toast and store the dismiss function
    const { id: loadingToastId, dismiss: dismissLoadingToast } = toast({
      title: 'Processing your order',
      description: 'Please wait while we process your payment...',
      type: 'info',
      duration: 0 // Don't auto-dismiss
    });

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Process order here (would be an API call in a real app)
      const orderData = {
        customer: {
          id: user?.id,
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
        payment: {
          method: formData.paymentMethod,
          cardLast4: formData.cardNumber.slice(-4),
        },
        items: cart,
        total: totalPrice,
        status: 'processing',
      };

      console.log('Order submitted:', orderData);
      
      // Clear cart
      clearCart();
      
      // Dismiss loading toast
      dismissLoadingToast();
      
      // Show success message
      toast({
        title: 'Order placed successfully!',
        description: 'Your order has been confirmed and is being processed.',
        type: 'success',
        duration: 5000
      });
      
      // Redirect to order confirmation
      navigate('/order-confirmation', { 
        state: { 
          orderNumber: `#${Math.floor(100000 + Math.random() * 900000)}`,
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
        } 
      });
    } catch (error) {
      console.error('Error processing order:', error);
      
      // Dismiss loading toast if it's still showing
      if (dismissLoadingToast) {
        dismissLoadingToast();
      }
      
      // Show error message
      toast({
        title: 'Order processing failed',
        description: 'There was an error processing your order. Please try again.',
        type: 'error',
        duration: 5000
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between max-w-2xl mx-auto mb-12">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <button
            onClick={() => step < currentStep && setCurrentStep(step)}
            className={`flex flex-col items-center ${step <= currentStep ? 'text-blue-600' : 'text-gray-400'}`}
            disabled={step > currentStep}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                step <= currentStep ? 'bg-blue-100' : 'bg-gray-100'
              }`}
            >
              {step < currentStep ? (
                <Check className="w-5 h-5 text-blue-600" />
              ) : (
                <span className="font-medium">{step}</span>
              )}
            </div>
            <span className="text-sm font-medium">
              {step === 1 ? 'Shipping' : step === 2 ? 'Payment' : 'Review'}
            </span>
          </button>
          {step < 3 && (
            <div className="flex-1 h-1 mx-2 bg-gray-200 rounded-full">
              <div
                className={`h-full rounded-full ${
                  step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
                style={{ width: step < currentStep ? '100%' : '0%' }}
              />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Shipping Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.lastName && (
                  <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                )}
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={values.phone}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(123) 456-7890"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={values.address}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={values.city}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                )}
              </div>
              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State/Province *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={values.state}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.state ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.state && (
                  <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                )}
              </div>
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP/Postal Code *
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={values.zipCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.zipCode ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.zipCode && (
                  <p className="mt-1 text-sm text-red-600">{errors.zipCode}</p>
                )}
              </div>
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <select
                  id="country"
                  name="country"
                  value={values.country}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>Australia</option>
                  <option>Germany</option>
                </select>
              </div>
            </div>
            <div className="flex items-start mt-6">
              <div className="flex items-center h-5">
                <input
                  id="saveInfo"
                  name="saveInfo"
                  type="checkbox"
                  checked={values.saveInfo}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="saveInfo" className="font-medium text-gray-700">
                  Save this information for next time
                </label>
                <p className="text-gray-500">
                  Your personal data will be used to process your order and for other purposes described in our privacy policy.
                </p>
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Payment Method</h2>
            <div className="space-y-4">
              <div className="flex items-center">
                <input
                  id="credit"
                  name="paymentMethod"
                  type="radio"
                  value="credit"
                  checked={values.paymentMethod === 'credit'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="credit" className="ml-3 block text-sm font-medium text-gray-700">
                  Credit / Debit Card
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="paypal"
                  name="paymentMethod"
                  type="radio"
                  value="paypal"
                  checked={values.paymentMethod === 'paypal'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="paypal" className="ml-3 block text-sm font-medium text-gray-700">
                  PayPal
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="bank"
                  name="paymentMethod"
                  type="radio"
                  value="bank"
                  checked={values.paymentMethod === 'bank'}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <label htmlFor="bank" className="ml-3 block text-sm font-medium text-gray-700">
                  Bank Transfer
                </label>
              </div>
            </div>

            {values.paymentMethod === 'credit' && (
              <div className="mt-6 space-y-6 bg-gray-50 p-6 rounded-lg">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={values.cardNumber}
                    onChange={handleChange}
                    placeholder="1234 5678 9012 3456"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.cardNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.cardNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-gray-700 mb-1">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={values.cardExpiry}
                      onChange={handleChange}
                      placeholder="MM/YY"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.cardExpiry ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardExpiry && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardExpiry}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-gray-700 mb-1">
                      CVC *
                    </label>
                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      value={values.cardCvc}
                      onChange={handleChange}
                      placeholder="123"
                      className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.cardCvc ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors.cardCvc && (
                      <p className="mt-1 text-sm text-red-600">{errors.cardCvc}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {values.paymentMethod === 'paypal' && (
              <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  You will be redirected to PayPal to complete your purchase securely.
                </p>
              </div>
            )}

            {values.paymentMethod === 'bank' && (
              <div className="mt-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="text-lg font-medium text-blue-800 mb-2">Bank Transfer Details</h3>
                <p className="text-blue-700 mb-4">
                  Please use the following details for your bank transfer. Your order will be processed once payment is received.
                </p>
                <div className="bg-white p-4 rounded-md border border-blue-100">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Bank Name</p>
                      <p className="font-medium">Global Commerce Bank</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Name</p>
                      <p className="font-medium">MarketHub Inc.</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-mono">1234 5678 9012 3456</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">SWIFT/BIC</p>
                      <p className="font-mono">GLOBBE12</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-sm text-gray-500">Reference</p>
                      <p className="font-mono">ORDER-{Math.floor(100000 + Math.random() * 900000)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
              
              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                <p className="text-gray-700">
                  {values.firstName} {values.lastName}<br />
                  {values.address}<br />
                  {values.city}, {values.state} {values.zipCode}<br />
                  {values.country}<br />
                  {values.phone}
                </p>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                <div className="flex items-center">
                  {values.paymentMethod === 'credit' && (
                    <>
                      <CreditCard className="h-6 w-6 text-gray-400 mr-3" />
                      <span className="text-gray-700">
                        Ending in {values.cardNumber.slice(-4)}
                        <span className="text-sm text-gray-500 ml-2">Expires {values.cardExpiry}</span>
                      </span>
                    </>
                  )}
                  {values.paymentMethod === 'paypal' && (
                    <span className="text-gray-700">PayPal</span>
                  )}
                  {values.paymentMethod === 'bank' && (
                    <span className="text-gray-700">Bank Transfer</span>
                  )}
                </div>
              </div>

              <div className="bg-white border rounded-lg overflow-hidden">
                <h3 className="px-6 py-4 border-b font-medium text-gray-900">Order Items</h3>
                <ul className="divide-y divide-gray-200">
                  {cart.map((item) => (
                    <li key={item.productId} className="p-6 flex">
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                        <img
                          src={item.image || 'https://via.placeholder.com/96'}
                          alt={item.name}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-gray-200 p-6">
                  <div className="flex justify-between text-base font-medium text-gray-900">
                    <p>Subtotal</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-2">
                    <p>Shipping</p>
                    <p>Free</p>
                  </div>
                  <div className="flex justify-between text-base font-medium text-gray-900 mt-4 pt-4 border-t border-gray-200">
                    <p>Total</p>
                    <p>${totalPrice.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-start mt-8">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  checked={values.terms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a> *
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-600">{errors.terms}</p>
                )}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {currentStep === 1 ? 'Shipping Information' : 
             currentStep === 2 ? 'Payment Method' : 'Review Your Order'}
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            {currentStep === 1 ? 'Enter your shipping details to continue with checkout' :
             currentStep === 2 ? 'Choose your preferred payment method' :
             'Please review your order before proceeding'}
          </p>
        </div>

        {renderStepIndicator()}

        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {renderStep()}
            
            <div className="flex justify-between pt-6 border-t border-gray-200">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentStep(currentStep - 1);
                    window.scrollTo(0, 0);
                  }}
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back
                </button>
              ) : (
                <Link
                  to="/cart"
                  className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Cart
                </Link>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting}
                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white ${
                  isSubmitting
                    ? 'bg-blue-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                }`}
              >
                {isSubmitting ? (
                  'Processing...'
                ) : currentStep === 3 ? (
                  'Place Order'
                ) : (
                  'Continue to Payment'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-blue-100 p-2 rounded-full">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="ml-3 font-medium text-gray-900">Free Shipping</h3>
            </div>
            <p className="text-sm text-gray-600">
              Free shipping on all orders over $50. Orders are processed and shipped within 1-2 business days.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-green-100 p-2 rounded-full">
                <Check className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="ml-3 font-medium text-gray-900">Quality Guarantee</h3>
            </div>
            <p className="text-sm text-gray-600">
              We stand behind our products. If you're not satisfied, return it within 30 days for a full refund.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-purple-100 p-2 rounded-full">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="ml-3 font-medium text-gray-900">Secure Checkout</h3>
            </div>
            <p className="text-sm text-gray-600">
              Your payment information is processed securely. We do not store credit card details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
