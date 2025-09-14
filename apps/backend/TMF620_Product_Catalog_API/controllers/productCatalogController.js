const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductSpecification = require('../models/ProductSpecification');
const ProductOffering = require('../models/ProductOffering');
const ProductCatalog = require('../models/ProductCatalog');

// GET /api/v1/productCatalog - Get catalog overview with statistics
const getCatalogOverview = async (req, res) => {
  try {
    const [
      productCount,
      categoryCount,
      productSpecCount,
      productOfferingCount,
      activeProducts,
      activeCategories,
      catalogs
    ] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      ProductSpecification.countDocuments(),
      ProductOffering.countDocuments(),
      Product.countDocuments({ lifecycleStatus: 'Active' }),
      Category.countDocuments({ lifecycleStatus: 'Active' }),
      ProductCatalog.find({}, 'id name description lifecycleStatus version createdAt updatedAt')
    ]);

    res.json({
      catalog: {
        name: 'TMF620 Product Catalog',
        version: '1.0.0',
        description: 'Product catalog management system based on TMF620 standards',
        statistics: {
          totalProducts: productCount,
          totalCategories: categoryCount,
          totalProductSpecifications: productSpecCount,
          totalProductOfferings: productOfferingCount,
          activeProducts: activeProducts,
          activeCategories: activeCategories
        },
        catalogs,
        endpoints: {
          products: '/api/v1/products',
          categories: '/api/v1/categories',
          productSpecifications: '/api/v1/productSpecifications',
          productOfferings: '/api/v1/productOfferings'
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /api/v1/productCatalog/search - Global search across all entities
const globalSearch = async (req, res) => {
  try {
    const { q, type, limit = 20 } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const searchRegex = new RegExp(q, 'i');
    const searchLimit = Math.min(parseInt(limit), 100);
    
    const searchPromises = [];
    
    if (!type || type === 'product') {
      searchPromises.push(
        Product.find({ name: searchRegex }, 'id name description lifecycleStatus brand')
          .limit(searchLimit)
          .then(products => products.map(p => ({ ...p.toObject(), type: 'product' })))
      );
    }
    
    if (!type || type === 'category') {
      searchPromises.push(
        Category.find({ name: searchRegex }, 'id name description lifecycleStatus')
          .limit(searchLimit)
          .then(categories => categories.map(c => ({ ...c.toObject(), type: 'category' })))
      );
    }
    
    if (!type || type === 'productSpecification') {
      searchPromises.push(
        ProductSpecification.find({ name: searchRegex }, 'id name description lifecycleStatus brand')
          .limit(searchLimit)
          .then(specs => specs.map(s => ({ ...s.toObject(), type: 'productSpecification' })))
      );
    }
    
    if (!type || type === 'productOffering') {
      searchPromises.push(
        ProductOffering.find({ name: searchRegex }, 'id name description lifecycleStatus isSellable')
          .limit(searchLimit)
          .then(offerings => offerings.map(o => ({ ...o.toObject(), type: 'productOffering' })))
      );
    }

    const results = await Promise.all(searchPromises);
    const allResults = results.flat();
    
    // Sort by relevance (exact matches first, then partial matches)
    allResults.sort((a, b) => {
      const aExact = a.name.toLowerCase() === q.toLowerCase();
      const bExact = b.name.toLowerCase() === q.toLowerCase();
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return a.name.localeCompare(b.name);
    });

    res.json({
      query: q,
      type: type || 'all',
      results: allResults.slice(0, searchLimit),
      total: allResults.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /api/v1/productCatalogs - List product catalogs
const listProductCatalogs = async (req, res) => {
  try {
    const { offset = 0, limit = 20, name } = req.query;
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    
    const data = await ProductCatalog.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    
    const total = await ProductCatalog.countDocuments(filter);
    
    res.json({
      data,
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        total,
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /api/v1/productCatalogs/:id - Get product catalog by ID
const getProductCatalog = async (req, res) => {
  try {
    const catalog = await ProductCatalog.findOne({ id: req.params.id });
    
    if (!catalog) {
      return res.status(404).json({ error: 'Product Catalog not found' });
    }

    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /api/v1/productCatalogs - Create new product catalog
const createProductCatalog = async (req, res) => {
  try {
    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/api/v1/productCatalogs/${req.body.id}`;
    }

    const catalog = new ProductCatalog(req.body);
    await catalog.save();

    res.status(201).json(catalog);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Product Catalog with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// PATCH /api/v1/productCatalogs/:id - Update product catalog
const updateProductCatalog = async (req, res) => {
  try {
    const catalog = await ProductCatalog.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!catalog) {
      return res.status(404).json({ error: 'Product Catalog not found' });
    }

    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// DELETE /api/v1/productCatalogs/:id - Delete product catalog
const deleteProductCatalog = async (req, res) => {
  try {
    const catalog = await ProductCatalog.findOneAndDelete({ id: req.params.id });

    if (!catalog) {
      return res.status(404).json({ error: 'Product Catalog not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  getCatalogOverview,
  globalSearch,
  listProductCatalogs,
  getProductCatalog,
  createProductCatalog,
  updateProductCatalog,
  deleteProductCatalog
};
