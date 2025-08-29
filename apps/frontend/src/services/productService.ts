import { apiClient } from '@/lib/api/baseApi';

// Types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  type: string;
  status: 'active' | 'inactive' | 'discontinued';
  brand?: string;
  model?: string;
  gtin?: string;
  upc?: string;
  ean?: string;
  isbn?: string;
  images?: ProductImage[];
  tags?: string[];
  attributes?: Record<string, any>;
  categories: Category[];
  specifications?: ProductSpecification[];
  prices: ProductPrice[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  title?: string;
  type?: 'thumbnail' | 'main' | 'gallery' | 'document' | 'other';
  displayOrder?: number;
  metadata?: Record<string, any>;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  isFeatured?: boolean;
  displayOrder?: number;
  images?: CategoryImage[];
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  attributes?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryImage {
  id: string;
  url: string;
  altText?: string;
  title?: string;
  type: 'thumbnail' | 'banner' | 'gallery' | 'icon' | 'logo' | 'other';
  width?: number;
  height?: number;
  fileSize?: number;
  mimeType?: string;
  displayOrder?: number;
  metadata?: Record<string, any>;
}

export interface ProductSpecification {
  id: string;
  name: string;
  description?: string;
  value: string | number | boolean | string[] | number[];
  type: 'text' | 'number' | 'boolean' | 'select' | 'multiselect' | 'date' | 'datetime';
  unit?: string;
  isVisible: boolean;
  isFilterable: boolean;
  isComparable: boolean;
  isRequired: boolean;
  displayOrder?: number;
  options?: {
    label: string;
    value: string | number;
  }[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductPrice {
  id: string;
  type: 'one-time' | 'recurring' | 'usage';
  amount: number;
  currency: string;
  compareAtPrice?: number;
  costPrice?: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  billingPeriod?: {
    period: 'day' | 'week' | 'month' | 'year';
    interval: number;
  };
  tiers?: {
    from: number;
    to?: number;
    amount: number;
  }[];
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// API Methods
export const productService = {
  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    status?: string;
    minPrice?: number;
    maxPrice?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    return apiClient.get<{ data: Product[]; total: number; page: number; limit: number }>('/products', { params });
  },

  async getProductById(id: string) {
    return apiClient.get<Product>(`/products/${id}`);
  },

  async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<Product>('/products', data);
  },

  async updateProduct(id: string, data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) {
    return apiClient.put<Product>(`/products/${id}`, data);
  },

  async deleteProduct(id: string) {
    return apiClient.delete(`/products/${id}`);
  },

  // Category methods
  async getCategories(params?: {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string | null;
    isActive?: boolean;
    isFeatured?: boolean;
  }) {
    return apiClient.get<{ data: Category[]; total: number; page: number; limit: number }>('/categories', { params });
  },

  async getCategoryTree(includeInactive = false) {
    return apiClient.get<Category[]>('/categories/tree', { params: { includeInactive } });
  },

  async getCategoryById(id: string) {
    return apiClient.get<Category>(`/categories/${id}`);
  },

  async getCategoryBySlug(slug: string) {
    return apiClient.get<Category>(`/categories/slug/${slug}`);
  },

  async createCategory(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<Category>('/categories', data);
  },

  async updateCategory(id: string, data: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) {
    return apiClient.put<Category>(`/categories/${id}`, data);
  },

  async deleteCategory(id: string) {
    return apiClient.delete(`/categories/${id}`);
  },

  // Product Specification methods
  async getProductSpecifications(productId: string) {
    return apiClient.get<ProductSpecification[]>(`/products/${productId}/specifications`);
  },

  async addProductSpecification(productId: string, data: Omit<ProductSpecification, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<ProductSpecification>(`/products/${productId}/specifications`, data);
  },

  // Price methods
  async getProductPrices(productId: string) {
    return apiClient.get<ProductPrice[]>(`/products/${productId}/prices`);
  },

  async addProductPrice(productId: string, data: Omit<ProductPrice, 'id' | 'createdAt' | 'updatedAt'>) {
    return apiClient.post<ProductPrice>(`/products/${productId}/prices`, data);
  },

  // Search methods
  async searchProducts(query: string, filters: Record<string, any> = {}) {
    return apiClient.get<{ data: Product[]; total: number }>('/products/search', {
      params: { query, ...filters },
    });
  },

  // Featured products
  async getFeaturedProducts(limit = 10) {
    return apiClient.get<Product[]>(`/products/featured?limit=${limit}`);
  },

  // Related products
  async getRelatedProducts(productId: string, limit = 4) {
    return apiClient.get<Product[]>(`/products/${productId}/related?limit=${limit}`);
  },

  // Category products
  async getProductsByCategory(categoryId: string, params?: { page?: number; limit?: number; sortBy?: string }) {
    return apiClient.get<{ data: Product[]; total: number; page: number; limit: number }>(
      `/categories/${categoryId}/products`,
      { params }
    );
  },

  // Bulk operations
  async bulkCreateProducts(products: Array<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) {
    return apiClient.post<{ success: boolean; count: number }>('/products/bulk', { products });
  },

  async bulkUpdateProducts(updates: Array<{ id: string; data: Partial<Omit<Product, 'id'>> }>) {
    return apiClient.put<{ success: boolean; count: number }>('/products/bulk', { updates });
  },

  // Import/Export
  async exportProducts(params?: { format?: 'csv' | 'json' | 'xlsx' }) {
    return apiClient.get('/products/export', { params, responseType: 'blob' });
  },

  async importProducts(file: File, format: 'csv' | 'json' = 'csv') {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post<{ success: boolean; count: number; errors?: any[] }>(
      `/products/import?format=${format}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },
};
