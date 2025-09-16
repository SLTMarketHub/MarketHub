const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const exportJobController = require('../controllers/exportJobController');

// Validation middleware for ExportJob
const validateExportJob = [
  body('url').notEmpty().withMessage('URL is required').isURL().withMessage('URL must be valid'),
  body('contentType').optional().isString().withMessage('Content type must be a string'),
  body('path').optional().isString().withMessage('Path must be a string'),
  body('query').optional().isString().withMessage('Query must be a string'),
  body('status').optional().isIn(['notStarted', 'running', 'succeeded', 'failed']).withMessage('Invalid status value')
];

// Validation middleware for query parameters
const validateQueryParams = [
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['notStarted', 'running', 'succeeded', 'failed']).withMessage('Invalid status filter'),
  query('contentType').optional().isString().withMessage('Content type filter must be a string')
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
router.get('/', validateQueryParams, handleValidationErrors, exportJobController.listExportJobs);
router.get('/:id', exportJobController.getExportJob);
router.post('/', validateExportJob, handleValidationErrors, exportJobController.createExportJob);
router.patch('/:id', exportJobController.updateExportJob);
router.delete('/:id', exportJobController.deleteExportJob);
router.post('/:id/start', exportJobController.startExportJob);

module.exports = router;