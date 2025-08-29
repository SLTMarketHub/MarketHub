import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProductCatalogContext } from '../../contexts/ProductCatalogContext';
import { 
  Box, 
  Typography, 
  Button, 
  Container, 
  Grid, 
  Paper, 
  Divider, 
  Chip, 
  CircularProgress, 
  Alert, 
  Tabs, 
  Tab, 
  Rating,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ShoppingCart, ArrowBack, Favorite, Share, ZoomIn } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`product-tabpanel-${index}`}
      aria-labelledby={`product-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `product-tab-${index}`,
    'aria-controls': `product-tabpanel-${index}`,
  };
}

const StyledTabs = styled(Tabs)({
  '& .MuiTabs-indicator': {
    backgroundColor: 'primary.main',
  },
});

const StyledTab = styled(Tab)({
  '&.Mui-selected': {
    color: 'primary.main',
    fontWeight: 'bold',
  },
});

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const {
    selectedProduct,
    loading,
    error,
    fetchProductById,
  } = useProductCatalogContext();
  
  const [tabValue, setTabValue] = useState(0);
  const [mainImage, setMainImage] = useState('');
  const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch product details when component mounts or id changes
  useEffect(() => {
    if (id) {
      fetchProductById(id);
    }
  }, [id, fetchProductById]);

  // Set main image when product or images change
  useEffect(() => {
    if (selectedProduct?.images && selectedProduct.images.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  // Handle tab change
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Handle specification selection
  const handleSpecSelect = (specId: string, value: string) => {
    setSelectedSpecs(prev => ({
      ...prev,
      [specId]: value
    }));
  };

  // Handle quantity change
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  // Add to cart handler
  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Added to cart:', {
      productId: selectedProduct?.id,
      name: selectedProduct?.name,
      quantity,
      selectedSpecs,
      price: selectedProduct?.prices?.[0]?.amount
    });
  };

  if (loading && !selectedProduct) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          Error loading product: {error.message}
        </Alert>
        <Button
          component={Link}
          to="/catalog"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Catalog
        </Button>
      </Container>
    );
  }

  if (!selectedProduct) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Product not found
        </Typography>
        <Button
          component={Link}
          to="/catalog"
          variant="contained"
          startIcon={<ArrowBack />}
          sx={{ mt: 2 }}
        >
          Back to Catalog
        </Button>
      </Container>
    );
  }

  // Prepare images for gallery
  const galleryImages = selectedProduct.images?.map(img => ({
    original: img.url,
    thumbnail: img.url,
    originalAlt: selectedProduct.name,
    thumbnailAlt: selectedProduct.name,
    loading: 'lazy',
  })) || [];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Back button */}
      <Button
        component={Link}
        to="/catalog"
        startIcon={<ArrowBack />}
        sx={{ mb: 3 }}
      >
        Back to Catalog
      </Button>

      {/* Main product content */}
      <Grid container spacing={4}>
        {/* Product images */}
        <Grid item xs={12} md={6}>
          {galleryImages.length > 0 ? (
            <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
              <ImageGallery
                items={galleryImages}
                showPlayButton={false}
                showFullscreenButton={!isMobile}
                showNav={!isMobile}
                showThumbnails={galleryImages.length > 1}
                thumbnailPosition={isMobile ? 'bottom' : 'left'}
                additionalClass="product-gallery"
              />
            </Paper>
          ) : (
            <Box 
              bgcolor="background.paper" 
              height={400} 
              display="flex" 
              alignItems="center" 
              justifyContent="center"
              borderRadius={2}
              overflow="hidden"
            >
              <Typography color="text.secondary">No image available</Typography>
            </Box>
          )}
        </Grid>

        {/* Product info */}
        <Grid item xs={12} md={6}>
          <Box mb={3}>
            <Typography variant="h4" component="h1" gutterBottom>
              {selectedProduct.name}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={2}>
              <Rating 
                value={4.5} 
                precision={0.5} 
                readOnly 
                size="small"
                sx={{ mr: 1 }}
              />
              <Typography variant="body2" color="text.secondary">
                (24 reviews)
              </Typography>
              <Typography 
                variant="body2" 
                color={selectedProduct.status === 'active' ? 'success.main' : 'error.main'}
                ml={2}
                fontWeight="medium"
              >
                {selectedProduct.status === 'active' ? 'In Stock' : 'Out of Stock'}
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
              ${selectedProduct.prices?.[0]?.amount?.toFixed(2) || '0.00'}
            </Typography>

            <Typography variant="body1" paragraph>
              {selectedProduct.description}
            </Typography>

            {/* Product specifications */}
            {selectedProduct.specifications && selectedProduct.specifications.length > 0 && (
              <Box mb={3}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Specifications
                </Typography>
                <Grid container spacing={2}>
                  {selectedProduct.specifications.map((spec) => (
                    <Grid item xs={12} sm={6} key={spec.id}>
                      <Typography variant="body2" fontWeight="medium">
                        {spec.name}:
                      </Typography>
                      {spec.type === 'select' && spec.options ? (
                        <Select
                          size="small"
                          fullWidth
                          value={selectedSpecs[spec.id] || ''}
                          onChange={(e) => handleSpecSelect(spec.id, e.target.value as string)}
                          sx={{ mt: 0.5 }}
                        >
                          {spec.options.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {spec.value} {spec.unit || ''}
                        </Typography>
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            {/* Add to cart */}
            <Box mt={4}>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="subtitle1" fontWeight="bold" mr={2}>
                  Quantity:
                </Typography>
                <Button 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 32, height: 32 }}
                >
                  -
                </Button>
                <Typography mx={2} minWidth={24} textAlign="center">
                  {quantity}
                </Typography>
                <Button 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= 10}
                  variant="outlined"
                  size="small"
                  sx={{ minWidth: 32, height: 32 }}
                >
                  +
                </Button>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<ShoppingCart />}
                onClick={handleAddToCart}
                disabled={selectedProduct.status !== 'active'}
                sx={{ py: 1.5, mb: 2 }}
              >
                {selectedProduct.status === 'active' ? 'Add to Cart' : 'Out of Stock'}
              </Button>

              <Box display="flex" gap={2}>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Favorite />}
                  fullWidth
                >
                  Wishlist
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<Share />}
                  fullWidth
                >
                  Share
                </Button>
              </Box>
            </Box>

            {/* Categories */}
            {selectedProduct.categories && selectedProduct.categories.length > 0 && (
              <Box mt={3}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Categories:
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {selectedProduct.categories.map((category) => (
                    <Chip
                      key={category.id}
                      label={category.name}
                      component={Link}
                      to={`/catalog?category=${category.id}`}
                      clickable
                      size="small"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Tabs for additional information */}
      <Box mt={6}>
        <Paper elevation={0} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <StyledTabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="product details tabs"
            variant="scrollable"
            scrollButtons="auto"
          >
            <StyledTab label="Description" {...a11yProps(0)} />
            <StyledTab label="Specifications" {...a11yProps(1)} />
            <StyledTab label="Reviews" {...a11yProps(2)} />
            <StyledTab label="Shipping & Returns" {...a11yProps(3)} />
          </StyledTabs>

          <TabPanel value={tabValue} index={0}>
            <Typography variant="body1" paragraph>
              {selectedProduct.description || 'No description available.'}
            </Typography>
            {/* Add more detailed description content here */}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {selectedProduct.specifications && selectedProduct.specifications.length > 0 ? (
              <Grid container spacing={2}>
                {selectedProduct.specifications.map((spec) => (
                  <Grid item xs={12} sm={6} key={spec.id}>
                    <Box display="flex" mb={1.5}>
                      <Typography variant="subtitle2" fontWeight="medium" sx={{ minWidth: 150 }}>
                        {spec.name}:
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {Array.isArray(spec.value) 
                          ? spec.value.join(', ') 
                          : `${spec.value} ${spec.unit || ''}`}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography variant="body1" color="text.secondary">
                No specifications available.
              </Typography>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Typography variant="h6" gutterBottom>
              Customer Reviews
            </Typography>
            <Typography color="text.secondary">
              No reviews yet. Be the first to review this product!
            </Typography>
            {/* Add review form and list here */}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography paragraph>
              Standard shipping: 3-5 business days
              <br />
              Express shipping: 1-2 business days
              <br />
              Free shipping on orders over $50
            </Typography>
            <Typography variant="h6" gutterBottom>
              Returns
            </Typography>
            <Typography>
              30-day return policy. Items must be in original condition with all tags attached.
            </Typography>
          </TabPanel>
        </Paper>
      </Box>

      {/* Related products section */}
      <Box mt={8}>
        <Typography variant="h5" gutterBottom>
          You May Also Like
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Check out these similar products
        </Typography>
        
        {/* TODO: Add related products carousel */}
        <Box bgcolor="background.paper" p={4} borderRadius={2} textAlign="center">
          <Typography color="text.secondary">
            Related products will be displayed here
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default ProductDetail;
