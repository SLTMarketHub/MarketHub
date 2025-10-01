const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const productOfferingController = require('../controllers/productOfferingController');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    if (!/^image\//.test(file.mimetype)) {
      return cb(new Error('Only image uploads are allowed'));
    }
    cb(null, true);
  }
});

// Validation middleware
const validateProductOffering = [
  body('id').notEmpty().withMessage('Product Offering ID is required'),
  body('name').notEmpty().withMessage('Product Offering name is required'),
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
router.get('/', validateQueryParams, handleValidationErrors, productOfferingController.listProductOfferings);
router.get('/:id', productOfferingController.getProductOffering);
router.post('/', validateProductOffering, handleValidationErrors, productOfferingController.createProductOffering);
router.patch('/:id', productOfferingController.updateProductOffering);
router.delete('/:id', productOfferingController.deleteProductOffering);

// Image upload for a product offering
router.post('/:id/attachments', upload.single('image'), productOfferingController.uploadProductOfferingImage);

module.exports = router;
