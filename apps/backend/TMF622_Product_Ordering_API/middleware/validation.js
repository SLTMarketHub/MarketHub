import { body, validationResult } from 'express-validator';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

export const productValidationRules = {
  createProduct: [
    body('name')
      .trim()
      .notEmpty().withMessage('Product name is required')
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description')
      .notEmpty().withMessage('Description is required')
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('price')
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number')
      .notEmpty().withMessage('Price is required'),
    body('category')
      .notEmpty().withMessage('Category is required')
      .isIn(['Electronics', 'Books', 'Clothing', 'Home', 'Sports', 'Other'])
      .withMessage('Invalid category'),
    body('stockCount')
      .optional()
      .isInt({ min: 0 }).withMessage('Stock count cannot be negative')
  ],

  updateProduct: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
    body('description')
      .optional()
      .trim()
      .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('price')
      .optional()
      .isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('category')
      .optional()
      .isIn(['Electronics', 'Books', 'Clothing', 'Home', 'Sports', 'Other'])
      .withMessage('Invalid category'),
    body('stockCount')
      .optional()
      .isInt({ min: 0 }).withMessage('Stock count cannot be negative')
  ]
};


