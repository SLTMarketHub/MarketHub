const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const productSpecificationController = require('../controllers/productSpecificationController');

// Validation middleware
const validateProductSpecification = [
  body('id').notEmpty().withMessage('Product Specification ID is required'),
  body('name').notEmpty().withMessage('Product Specification name is required'),
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
router.get('/', validateQueryParams, handleValidationErrors, productSpecificationController.listProductSpecifications);
router.get('/:id', productSpecificationController.getProductSpecification);
router.post('/', validateProductSpecification, handleValidationErrors, productSpecificationController.createProductSpecification);
router.patch('/:id', productSpecificationController.updateProductSpecification);
router.delete('/:id', productSpecificationController.deleteProductSpecification);

module.exports = router;
