import React, { useState, useEffect } from 'react';
import { useProductCatalogContext } from '../../contexts/ProductCatalogContext';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container, Box, TextField, Select, MenuItem, FormControl, InputLabel, Pagination, Chip, CircularProgress, Alert, Stack } from '@mui/material';
import { Search, FilterList, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const ProductCatalog: React.FC = () => {
  const {
    products,
    categories,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchCategories,
    fetchCategoryTree
  } = useProductCatalogContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  // Fetch products and categories on component mount
  useEffect(() => {
    fetchCategories();
    fetchCategoryTree();
  }, [fetchCategories, fetchCategoryTree]);

  // Fetch products when filters or pagination changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts({
        page,
        pageSize,
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        sortBy,
        sortOrder,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [page, pageSize, searchTerm, selectedCategory, sortBy, sortOrder, fetchProducts]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
    setPage(1); // Reset to first page on category change
  };

  const handleSortChange = (event: any) => {
    const [field, order] = event.target.value.split('_');
    setSortBy(field);
    setSortOrder(order as 'asc' | 'desc');
    setPage(1); // Reset to first page on sort change
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading products: {error.message}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header and Filters */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Product Catalog
        </Typography>
        
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search products..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: <Search sx={{ color: 'action.active', mr: 1 }} />,
            }}
            sx={{ flexGrow: 1, maxWidth: 400 }}
          />
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="category-filter-label">Category</InputLabel>
            <Select
              labelId="category-filter-label"
              id="category-filter"
              value={selectedCategory}
              label="Category"
              onChange={handleCategoryChange}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl sx={{ minWidth: 200 }} size="small">
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={`${sortBy}_${sortOrder}`}
              label="Sort By"
              onChange={handleSortChange}
            >
              <MenuItem value="name_asc">Name (A-Z)</MenuItem>
              <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              <MenuItem value="price_asc">Price (Low to High)</MenuItem>
              <MenuItem value="price_desc">Price (High to Low)</MenuItem>
              <MenuItem value="createdAt_desc">Newest First</MenuItem>
              <MenuItem value="createdAt_asc">Oldest First</MenuItem>
            </Select>
          </FormControl>
        </Box>
        
        {selectedCategory && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={`Category: ${categories.find(c => c.id === selectedCategory)?.name || selectedCategory}`}
              onDelete={() => setSelectedCategory('')}
              color="primary"
              variant="outlined"
              sx={{ mr: 1, mb: 1 }}
            />
            <Button
              size="small"
              onClick={() => setSelectedCategory('')}
              sx={{ textTransform: 'none' }}
            >
              Clear filters
            </Button>
          </Box>
        )}
      </Box>

      {/* Loading State */}
      {loading && products.length === 0 && (
        <Box display="flex" justifyContent="center" my={8}>
          <CircularProgress />
        </Box>
      )}

      {/* No Results */}
      {!loading && products.length === 0 && (
        <Box textAlign="center" my={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            No products found
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Try adjusting your search or filter criteria
          </Typography>
        </Box>
      )}

      {/* Product Grid */}
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {product.images && product.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="200"
                  image={product.images[0].url}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
              )}
              <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {product.description?.substring(0, 100)}{product.description && product.description.length > 100 ? '...' : ''}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                  <Typography variant="h6" color="primary">
                    ${product.prices?.[0]?.amount?.toFixed(2) || '0.00'}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/products/${product.id}`}
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<ShoppingCart />}
                  >
                    View Details
                  </Button>
                </Box>
                
                {product.categories && product.categories.length > 0 && (
                  <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {product.categories.slice(0, 2).map((category) => (
                      <Chip
                        key={category.id}
                        label={category.name}
                        size="small"
                        onClick={() => setSelectedCategory(category.id)}
                        sx={{ cursor: 'pointer' }}
                      />
                    ))}
                    {product.categories.length > 2 && (
                      <Chip
                        label={`+${product.categories.length - 2} more`}
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pagination.totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
      
      {/* Debug Info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {products.length} of {pagination.total} products (Page {page} of {pagination.totalPages})
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default ProductCatalog;
