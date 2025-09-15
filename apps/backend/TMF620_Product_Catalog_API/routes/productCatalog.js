const express = require('express');
const router = express.Router();
const { query, validationResult } = require('express-validator');
const productCatalogController = require('../controllers/productCatalogController');

// Validation middleware for search query parameters
const validateSearchParams = [
  query('q').notEmpty().withMessage('Search query is required'),
  query('type').optional().isIn(['product', 'category', 'specification', 'offering']),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes
router.get('/', productCatalogController.getCatalogOverview);
router.get('/search', validateSearchParams, handleValidationErrors, productCatalogController.globalSearch);

module.exports = router;