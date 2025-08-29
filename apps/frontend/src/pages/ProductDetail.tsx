import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, Heart, Share2, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

// Types
type Product = {
  id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  image: string;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  features: string[];
  specifications: Record<string, string>;
};

type Plan = {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
};

type Review = {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpful: number;
};

// Mock data
const mockProduct: Product = {
  id: '1',
  productId: 'prod_123',
  name: 'Premium Wireless Headphones',
  description: 'Experience crystal clear sound with our premium wireless headphones. Features noise cancellation and 30-hour battery life.',
  price: 299.99,
  currency: 'USD',
  image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80',
  category: 'Electronics',
  stock: 15,
  rating: 4.7,
  reviews: 128,
  features: [
    'Active Noise Cancellation',
    '30-hour battery life',
    'Bluetooth 5.0',
    'Built-in microphone',
    'Touch controls',
    'Foldable design'
  ],
  specifications: {
    'Color': 'Black',
    'Battery Life': '30 hours',
    'Connectivity': 'Bluetooth 5.0',
    'Noise Cancellation': 'Active',
    'Charging Time': '2 hours',
    'Warranty': '1 year'
  }
};

const plans: Plan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 0,
    description: 'Standard warranty',
    features: ['1-year limited warranty', 'Email support']
  },
  {
    id: 'plus',
    name: 'Plus',
    price: 29.99,
    description: 'Extended coverage',
    features: ['2-year warranty', 'Priority support', 'Free returns'],
    popular: true
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 59.99,
    description: 'All-inclusive protection',
    features: ['3-year warranty', '24/7 support', 'Free replacements', 'Accidental damage coverage']
  }
];

const mockReviews: Review[] = [
  {
    id: '1',
    author: 'Alex Johnson',
    rating: 5,
    date: '2023-05-15',
    comment: 'Amazing sound quality and battery life! The noise cancellation is a game changer.',
    helpful: 24
  },
  {
    id: '2',
    author: 'Sam Wilson',
    rating: 4,
    date: '2023-06-02',
    comment: 'Great headphones overall, but a bit pricey. The sound quality is excellent though.',
    helpful: 12
  }
];

const ProductDetail: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth() || {};
  const { addToCart } = useCart() || {};
  const { toast } = useToast() || {};
  
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  
  const product = mockProduct;
  const stock = product.stock;
  const isAvailable = stock > 0;
  const averageRating = mockReviews.length > 0 
    ? Number((mockReviews.reduce((sum, review) => sum + review.rating, 0) / mockReviews.length).toFixed(1))
    : 0;

  const handleAddToCart = () => {
    if (!selectedPlan) {
      toast?.({
        title: 'Select a Plan',
        description: 'Please select a plan before adding to cart',
      });
      return;
    }
    
    if (addToCart) {
      addToCart({
        ...product,
        quantity,
        selectedPlan: selectedPlan.name,
      });
      
      toast?.({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart`,
      });
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0 && newQuantity <= stock) {
      setQuantity(newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsInWishlist(!isInWishlist);
    toast?.({
      title: isInWishlist ? 'Removed from Wishlist' : 'Added to Wishlist',
      description: isInWishlist 
        ? 'Item has been removed from your wishlist' 
        : 'Item has been added to your wishlist',
    });
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/catalog" className="hover:text-blue-600">Catalog</Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/catalog/${product.category.toLowerCase()}`} className="hover:text-blue-600">
            {product.category}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">{product.name}</span>
        </div>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-square rounded-md overflow-hidden bg-gray-100 cursor-pointer">
                <img
                  src={product.image}
                  alt={`${product.name} view ${i}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm font-medium text-blue-600">{product.category}</span>
              <span className="text-gray-400">•</span>
              <div className="flex items-center">
                {renderStars(averageRating)}
                <span className="ml-2 text-sm text-gray-600">
                  {averageRating} ({product.reviews} reviews)
                </span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="mt-3 text-lg text-gray-700">
              ${product.price.toFixed(2)}
              {selectedPlan && selectedPlan.price > 0 && (
                <span className="ml-2 text-sm text-gray-500">
                  + ${selectedPlan.price.toFixed(2)} for {selectedPlan.name} plan
                </span>
              )}
            </p>
            <p className="mt-4 text-gray-600">{product.description}</p>
          </div>

          {/* Plan Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Choose Your Plan</h3>
            <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                    selectedPlan?.id === plan.id
                      ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-200' : ''}`}
                >
                  {plan.popular && (
                    <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mb-2">
                      Most Popular
                    </span>
                  )}
                  <h4 className="font-semibold text-gray-900">
                    {plan.name} {plan.price > 0 ? `+$${plan.price}` : 'Included'}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">{plan.description}</p>
                  <ul className="mt-3 space-y-2">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-4 h-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-md">
              <button
                onClick={() => handleQuantityChange(quantity - 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                −
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100"
                disabled={quantity >= stock}
              >
                +
              </button>
            </div>
            <span className="text-sm text-gray-500">{stock} in stock</span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable || !selectedPlan}
              className={`flex-1 px-6 py-3 rounded-md font-medium ${
                isAvailable && selectedPlan
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAvailable ? 'Add to Cart' : 'Out of Stock'}
            </button>
            <button
              onClick={toggleWishlist}
              className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center"
            >
              <Heart
                className={`w-5 h-5 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
          </div>

          {/* Features */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-start">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: `Reviews (${mockReviews.length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <h3>Features</h3>
              <ul>
                {product.features.map((feature, i) => (
                  <li key={i}>{feature}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 py-2">
                  <dt className="font-medium text-gray-900">{key}</dt>
                  <dd className="mt-1 text-gray-700">{value}</dd>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center mt-1">
                    {renderStars(averageRating)}
                    <span className="ml-2 text-sm text-gray-600">
                      {averageRating} out of 5
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{mockReviews.length} global ratings</p>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
                  Write a Review
                </button>
              </div>

              <div className="space-y-6">
                {mockReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6">
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {renderStars(review.rating)}
                      </div>
                      <h4 className="ml-2 text-sm font-medium text-gray-900">{review.author}</h4>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="mt-2 text-gray-700">{review.comment}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <span>Was this helpful?</span>
                      <button className="ml-4 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                        Yes ({review.helpful})
                      </button>
                      <button className="ml-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                        No
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
