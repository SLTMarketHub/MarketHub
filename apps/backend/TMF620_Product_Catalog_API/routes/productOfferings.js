const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const productOfferingController = require('../controllers/productOfferingController');
const multer = require('multer');


// Multer storage config
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { 
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 1 // Only allow 1 file at a time to prevent memory spikes
  },
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
router.get('/all', productOfferingController.getAllProductOfferings);                    // ← First
router.get('/byCategory/:id', productOfferingController.getProductOfferingByCategory);
router.get('/:id', productOfferingController.getProductOffering);                        // ← Last among GETs with param
router.post('/', validateProductOffering, handleValidationErrors, productOfferingController.createProductOffering);
router.patch('/:id', productOfferingController.updateProductOffering);
router.delete('/:id', productOfferingController.deleteProductOffering);
router.post('/:id/attachments', upload.single('image'), productOfferingController.uploadProductOfferingImage);
router.get('/:id/attachments/:attId', productOfferingController.getProductOfferingAttachment);

module.exports = router;
