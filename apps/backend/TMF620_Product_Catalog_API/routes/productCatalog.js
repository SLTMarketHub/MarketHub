const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const ProductSpecification = require('../models/ProductSpecification');
const ProductOffering = require('../models/ProductOffering');
const ProductCatalog = require('../models/ProductCatalog');

// GET /api/v1/productCatalog - Get catalog overview with statistics
router.get('/', async (req, res) => {
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
});

// GET /api/v1/productCatalog/search - Global search across all entities
router.get('/search', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('type').optional().isIn(['product', 'category', 'specification', 'offering']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { q, type, limit = 10 } = req.query;
    const searchRegex = new RegExp(q, 'i');
    const searchFilter = {
      $or: [
        { name: searchRegex },
        { description: searchRegex }
      ]
    };

    const results = {};

    if (!type || type === 'product') {
      results.products = await Product.find(searchFilter, 'id name description lifecycleStatus')
        .limit(parseInt(limit));
    }

    if (!type || type === 'category') {
      results.categories = await Category.find(searchFilter, 'id name description lifecycleStatus')
        .limit(parseInt(limit));
    }

    if (!type || type === 'specification') {
      results.productSpecifications = await ProductSpecification.find(searchFilter, 'id name description lifecycleStatus')
        .limit(parseInt(limit));
    }

    if (!type || type === 'offering') {
      results.productOfferings = await ProductOffering.find(searchFilter, 'id name description lifecycleStatus')
        .limit(parseInt(limit));
    }

    res.json({
      query: q,
      results
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;
