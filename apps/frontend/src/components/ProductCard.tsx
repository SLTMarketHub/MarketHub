import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Check, ArrowRight, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface Product {
  productId: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  availabilityStatus: string;
  effectiveDate: string;
  expirationDate: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
  features?: string[];
  image?: string;
}

interface ProductCardProps {
  product: Product;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, layout = 'grid' }) => {
  const [quantity, setQuantity] = useState(1);
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const isAvailable = product.availabilityStatus === 'Available';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      // Redirect to login or show login modal
      return;
    }
    
    setIsAdding(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      addToCart(product, quantity);
      toast({
        title: 'Added to cart',
        description: `${quantity} x ${product.name} has been added to your cart`,
        type: 'success',
        duration: 3000
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: 'Failed to add to cart',
        description: 'An error occurred while adding the product to your cart',
        type: 'error',
        duration: 3000
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value > 0) {
      setQuantity(value);
    }
  };

  const incrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'OutOfStock':
        return 'bg-red-100 text-red-800';
      case 'Discontinued':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Mobile':
        return 'bg-blue-100 text-blue-800';
      case 'Broadband':
        return 'bg-purple-100 text-purple-800';
      case 'Digital':
        return 'bg-teal-100 text-teal-800';
      case 'Business':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const defaultImage = `https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400`;

  if (layout === 'list') {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 aspect-video md:aspect-square">
            <img
              src={product.image || defaultImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-l-lg"
            />
          </div>
          <div className="flex-1 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
              <div>
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </span>
                    <Link
                      to={`/product/${product.productId}`}
                      className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View details <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                  
                  {isAvailable ? (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center border rounded-md">
                        <button 
                          onClick={decrementQuantity}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                          disabled={quantity <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={quantity}
                          onChange={handleQuantityChange}
                          className="w-12 text-center border-x border-gray-200 py-1 text-sm dark:border-gray-700"
                        />
                        <button 
                          onClick={incrementQuantity}
                          className="px-2 py-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={handleAddToCart}
                        disabled={isAdding || !isAvailable}
                        className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors ${
                          isAdding ? 'opacity-75 cursor-not-allowed' : ''
                        }`}
                      >
                        {isAdding ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Currently unavailable
                    </div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{product.description}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price}
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{product.currency}</span>
                </div>
                {product.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">{product.rating}</span>
                  </div>
                )}
              </div>
            </div>
            
            {product.features && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {product.features.slice(0, 3).map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-4 h-4 text-green-500 mr-1" />
                      {feature}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex space-x-3">
              <Link
                to={`/product/${product.productId}`}
                className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                View Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <button
                disabled={!isAvailable}
                className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                  isAvailable
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow group">
      <div className="aspect-video overflow-hidden rounded-t-lg">
        <img
          src={product.image || defaultImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
        />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(product.category)}`}>
            {product.category}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.availabilityStatus)}`}>
            {product.availabilityStatus}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{product.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        {product.features && (
          <div className="mb-4">
            <div className="space-y-1">
              {product.features.slice(0, 2).map((feature, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mr-2" />
                  {feature}
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ${product.price}
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400">/{product.currency}</span>
          </div>
          {product.rating && (
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm text-gray-600 ml-1">{product.rating}</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Link
            to={`/product/${product.productId}`}
            className="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </Link>
          <button
            disabled={!isAvailable}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              isAvailable
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};