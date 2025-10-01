const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const productOfferingPriceController = require('../controllers/productOfferingPriceController');

// Validation middleware
const validateProductOfferingPrice = [
  body('id').notEmpty().withMessage('ProductOfferingPrice ID is required'),
  body('name').notEmpty().withMessage('ProductOfferingPrice name is required'),
  body('priceType').notEmpty().isIn(['oneTime', 'recurring', 'usage']).withMessage('priceType must be oneTime|recurring|usage'),
  body('lifecycleStatus').optional().isIn(['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'])
];

// Validation middleware for query parameters
const validateQueryParams = [
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('fields').optional().isString().withMessage('Fields must be a string')
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
router.get('/', validateQueryParams, handleValidationErrors, productOfferingPriceController.listProductOfferingPrices);
router.get('/:id', productOfferingPriceController.getProductOfferingPrice);
router.post('/', validateProductOfferingPrice, handleValidationErrors, productOfferingPriceController.createProductOfferingPrice);
router.patch('/:id', productOfferingPriceController.updateProductOfferingPrice);
router.delete('/:id', productOfferingPriceController.deleteProductOfferingPrice);

module.exports = router;
