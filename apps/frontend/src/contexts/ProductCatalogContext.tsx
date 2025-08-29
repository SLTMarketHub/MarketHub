import React, { createContext, useContext, ReactNode } from 'react';
import { useProductCatalog } from '../hooks/useProductCatalog';

// Define the context type
type ProductCatalogContextType = ReturnType<typeof useProductCatalog>;

// Create the context with a default undefined value
const ProductCatalogContext = createContext<ProductCatalogContextType | undefined>(undefined);

// Provider component
interface ProductCatalogProviderProps {
  children: ReactNode;
  initialPage?: number;
  pageSize?: number;
}

export const ProductCatalogProvider: React.FC<ProductCatalogProviderProps> = ({
  children,
  initialPage = 1,
  pageSize = 10,
}) => {
  const productCatalog = useProductCatalog({ initialPage, pageSize });

  return (
    <ProductCatalogContext.Provider value={productCatalog}>
      {children}
    </ProductCatalogContext.Provider>
  );
};

// Custom hook to use the product catalog context
export const useProductCatalogContext = (): ProductCatalogContextType => {
  const context = useContext(ProductCatalogContext);
  if (context === undefined) {
    throw new Error('useProductCatalogContext must be used within a ProductCatalogProvider');
  }
  return context;
};

// Export the context for direct usage if needed
export default ProductCatalogContext;
