const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const ProductSpecification = require('../models/ProductSpecification');
const { publishEvent } = require('../services/eventPublisher');

// Validation middleware
const validateProductSpecification = [
  body('id').notEmpty().withMessage('Product Specification ID is required'),
  body('name').notEmpty().withMessage('Product Specification name is required'),
  body('lifecycleStatus').optional().isIn(['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'])
];

// GET /api/v1/productSpecifications - List product specifications with filtering and pagination
router.get('/', [
  query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be a non-negative integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('fields').optional().isString().withMessage('Fields must be a string')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      offset = 0,
      limit = 20,
      fields,
      name,
      lifecycleStatus,
      brand,
      productNumber,
      'validFor.startDateTime.gte': startDateGte,
      'validFor.startDateTime.lte': startDateLte
    } = req.query;

    // Build filter object
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (brand) filter.brand = new RegExp(brand, 'i');
    if (productNumber) filter.productNumber = productNumber;
    if (startDateGte || startDateLte) {
      filter['validFor.startDateTime'] = {};
      if (startDateGte) filter['validFor.startDateTime'].$gte = new Date(startDateGte);
      if (startDateLte) filter['validFor.startDateTime'].$lte = new Date(startDateLte);
    }

    // Build projection object
    let projection = {};
    if (fields) {
      const fieldList = fields.split(',');
      fieldList.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productSpecs = await ProductSpecification.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ProductSpecification.countDocuments(filter);

    res.json({
      data: productSpecs,
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
});

// GET /api/v1/productSpecifications/:id - Get product specification by ID
router.get('/:id', async (req, res) => {
  try {
    const { fields } = req.query;
    
    let projection = {};
    if (fields) {
      const fieldList = fields.split(',');
      fieldList.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productSpec = await ProductSpecification.findOne({ id: req.params.id }, projection);
    
    if (!productSpec) {
      return res.status(404).json({ error: 'Product Specification not found' });
    }

    res.json(productSpec);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// POST /api/v1/productSpecifications - Create new product specification
router.post('/', validateProductSpecification, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/api/v1/productSpecifications/${req.body.id}`;
    }

    const productSpec = new ProductSpecification(req.body);
    await productSpec.save();

    res.status(201).json(productSpec);
    publishEvent('ProductSpecificationCreateEvent', 'ProductSpecification', productSpec.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Product Specification with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// PATCH /api/v1/productSpecifications/:id - Update product specification
router.patch('/:id', async (req, res) => {
  try {
    const productSpec = await ProductSpecification.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!productSpec) {
      return res.status(404).json({ error: 'Product Specification not found' });
    }

    res.json(productSpec);
    if (productSpec) publishEvent('ProductSpecificationAttributeValueChangeEvent', 'ProductSpecification', productSpec.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// DELETE /api/v1/productSpecifications/:id - Delete product specification
router.delete('/:id', async (req, res) => {
  try {
    const productSpec = await ProductSpecification.findOneAndDelete({ id: req.params.id });

    if (!productSpec) {
      return res.status(404).json({ error: 'Product Specification not found' });
    }

    res.status(204).send();
    if (productSpec) publishEvent('ProductSpecificationDeleteEvent', 'ProductSpecification', productSpec.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;
