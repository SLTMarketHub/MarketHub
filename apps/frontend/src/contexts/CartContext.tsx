import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';
import type { Product, CartItem } from '../types/index';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedPlan?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('cart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('authToken');
    }
    return false;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cart));
    }
  }, [cart]);

  const login = useCallback((token: string) => {
    localStorage.setItem('authToken', token);
    setIsAuthenticated(true);
    toast({
      title: 'Login successful',
      description: 'You have been successfully logged in',
      type: 'success',
      duration: 3000
    });
  }, [toast]);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
      type: 'info',
      duration: 3000
    });
  }, [toast]);

  const addToCart = useCallback((product: Product, quantity: number = 1, selectedPlan?: string) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => 
        item.id === product.id && 
        (!selectedPlan || item.selectedPlan === selectedPlan)
      );
      
      if (existingItem) {
        const updatedCart = prevCart.map(item =>
          item.id === product.id && 
          (!selectedPlan || item.selectedPlan === selectedPlan)
            ? { ...item, quantity: item.quantity + quantity, selectedPlan }
            : item
        );
        
        toast({
          title: 'Cart updated',
          description: `Added ${quantity} more ${product.name} to your cart`,
          type: 'success',
          duration: 3000
        });
        
        return updatedCart;
      } else {
        const newItem = { 
          ...product, 
          quantity, 
          selectedPlan,
          description: ''
        };
        
        toast({
          title: 'Added to cart',
          description: `${quantity} x ${product.name} has been added to your cart`,
          type: 'success',
          duration: 3000
        });
        
        return [...prevCart, newItem];
      }
    });
  }, [toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCart(prevCart => {
      const itemToRemove = prevCart.find(item => item.id === productId);
      if (itemToRemove) {
        toast({
          title: 'Removed from cart',
          description: `${itemToRemove.name} has been removed from your cart`,
          type: 'info',
          duration: 3000
        });
      }
      return prevCart.filter(item => item.id !== productId);
    });
  }, [toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => {
      const updatedCart = prevCart.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
      
      const updatedItem = updatedCart.find(item => item.id === productId);
      const originalItem = prevCart.find(item => item.id === productId);
      
      if (updatedItem && originalItem && updatedItem.quantity !== originalItem.quantity) {
        const quantityDifference = updatedItem.quantity - originalItem.quantity;
        const action = quantityDifference > 0 ? 'added' : 'removed';
        const quantityText = Math.abs(quantityDifference) === 1 ? 'item' : 'items';
        
        toast({
          title: 'Cart updated',
          description: `${Math.abs(quantityDifference)} ${quantityText} of ${updatedItem.name} ${action}`,
          type: 'info',
          duration: 3000
        });
      }
      
      return updatedCart;
    });
  }, [removeFromCart, toast]);

  const clearCart = useCallback(() => {
    setCart([]);
    toast({
      title: 'Cart cleared',
      description: 'All items have been removed from your cart',
      type: 'info',
      duration: 3000
    });
  }, [toast]);

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
    isAuthenticated,
    login,
    logout
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
