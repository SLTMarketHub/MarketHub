import { useState, useEffect, useCallback } from 'react';
import { productService } from '../services/productService';
import type { 
  Product, 
  Category, 
  ProductSpecification, 
  ProductPrice 
} from '../services/productService';

interface UseProductCatalogProps {
  initialPage?: number;
  pageSize?: number;
}

export const useProductCatalog = ({ initialPage = 1, pageSize = 10 }: UseProductCatalogProps = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<Category[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: initialPage,
    pageSize,
    total: 0,
    totalPages: 0,
  });

  // Fetch products with pagination and filtering
  const fetchProducts = useCallback(
    async (params: {
      page?: number;
      pageSize?: number;
      search?: string;
      categoryId?: string;
      status?: string;
      minPrice?: number;
      maxPrice?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}) => {
      setLoading(true);
      setError(null);
      try {
        const { page = pagination.page, pageSize: size = pagination.pageSize, ...restParams } = params;
        const response = await productService.getProducts({
          page,
          limit: size,
          ...restParams,
        });

        setProducts(response.data);
        setPagination({
          page: response.page,
          pageSize: response.limit,
          total: response.total,
          totalPages: Math.ceil(response.total / response.limit),
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    },
    [pagination.page, pagination.pageSize]
  );

  // Fetch a single product by ID
  const fetchProductById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const product = await productService.getProductById(id);
      setSelectedProduct(product);
      return product;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch product'));
      console.error('Error fetching product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch categories
  const fetchCategories = useCallback(async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    parentId?: string | null;
    isActive?: boolean;
    isFeatured?: boolean;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await productService.getCategories(params);
      setCategories(response.data);
      return response;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch categories'));
      console.error('Error fetching categories:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch category tree
  const fetchCategoryTree = useCallback(async (includeInactive = false) => {
    setLoading(true);
    setError(null);
    try {
      const tree = await productService.getCategoryTree(includeInactive);
      setCategoryTree(tree);
      return tree;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch category tree'));
      console.error('Error fetching category tree:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch category by ID
  const fetchCategoryById = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const category = await productService.getCategoryById(id);
      setSelectedCategory(category);
      return category;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch category'));
      console.error('Error fetching category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch category by slug
  const fetchCategoryBySlug = useCallback(async (slug: string) => {
    setLoading(true);
    setError(null);
    try {
      const category = await productService.getCategoryBySlug(slug);
      setSelectedCategory(category);
      return category;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch category by slug'));
      console.error('Error fetching category by slug:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new product
  const createProduct = useCallback(async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newProduct = await productService.createProduct(productData);
      // Refresh the products list
      await fetchProducts({ page: pagination.page, pageSize: pagination.pageSize });
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create product'));
      console.error('Error creating product:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchProducts, pagination.page, pagination.pageSize]);

  // Update a product
  const updateProduct = useCallback(
    async (id: string, productData: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedProduct = await productService.updateProduct(id, productData);
        // Update the products list if needed
        if (selectedProduct?.id === id) {
          setSelectedProduct(updatedProduct);
        }
        await fetchProducts({ page: pagination.page, pageSize: pagination.pageSize });
        return updatedProduct;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update product'));
        console.error('Error updating product:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, pagination.page, pagination.pageSize, selectedProduct?.id]
  );

  // Delete a product
  const deleteProduct = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await productService.deleteProduct(id);
        // Refresh the products list
        await fetchProducts({ page: pagination.page, pageSize: pagination.pageSize });
        // Clear selected product if it was deleted
        if (selectedProduct?.id === id) {
          setSelectedProduct(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete product'));
        console.error('Error deleting product:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchProducts, pagination.page, pagination.pageSize, selectedProduct?.id]
  );

  // Create a new category
  const createCategory = useCallback(async (categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);
    setError(null);
    try {
      const newCategory = await productService.createCategory(categoryData);
      // Refresh the categories list
      await fetchCategories();
      await fetchCategoryTree();
      return newCategory;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to create category'));
      console.error('Error creating category:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchCategories, fetchCategoryTree]);

  // Update a category
  const updateCategory = useCallback(
    async (id: string, categoryData: Partial<Omit<Category, 'id' | 'createdAt' | 'updatedAt'>>) => {
      setLoading(true);
      setError(null);
      try {
        const updatedCategory = await productService.updateCategory(id, categoryData);
        // Update the categories list if needed
        if (selectedCategory?.id === id) {
          setSelectedCategory(updatedCategory);
        }
        await fetchCategories();
        await fetchCategoryTree();
        return updatedCategory;
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to update category'));
        console.error('Error updating category:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories, fetchCategoryTree, selectedCategory?.id]
  );

  // Delete a category
  const deleteCategory = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      try {
        await productService.deleteCategory(id);
        // Refresh the categories list
        await fetchCategories();
        await fetchCategoryTree();
        // Clear selected category if it was deleted
        if (selectedCategory?.id === id) {
          setSelectedCategory(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to delete category'));
        console.error('Error deleting category:', err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [fetchCategories, fetchCategoryTree, selectedCategory?.id]
  );

  // Initial data loading
  useEffect(() => {
    fetchProducts({ page: initialPage, pageSize });
    fetchCategories();
    fetchCategoryTree();
  }, [fetchProducts, fetchCategories, fetchCategoryTree, initialPage, pageSize]);

  return {
    // State
    products,
    categories,
    categoryTree,
    selectedProduct,
    selectedCategory,
    loading,
    error,
    pagination,
    
    // Actions
    fetchProducts,
    fetchProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    fetchCategories,
    fetchCategoryTree,
    fetchCategoryById,
    fetchCategoryBySlug,
    createCategory,
    updateCategory,
    deleteCategory,
    
    // Helpers
    setSelectedProduct,
    setSelectedCategory,
  };
};
