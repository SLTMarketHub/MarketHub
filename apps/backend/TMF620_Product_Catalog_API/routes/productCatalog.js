const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const productCatalogController = require('../controllers/productCatalogController');

// Validation middleware
const validateCatalog = [
  body('id').notEmpty().withMessage('Catalog ID is required'),
  body('name').notEmpty().withMessage('Catalog name is required'),
  body('lifecycleStatus').optional().isIn(['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'])
];

// Validation middleware for query parameters
const validateQueryParams = [
  query('offset').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
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
router.get('/', validateQueryParams, handleValidationErrors, productCatalogController.listProductCatalogs);
router.get('/:id', productCatalogController.getProductCatalog);
router.post('/', validateCatalog, handleValidationErrors, productCatalogController.createProductCatalog);
router.patch('/:id', productCatalogController.updateProductCatalog);
router.delete('/:id', productCatalogController.deleteProductCatalog);

module.exports = router;