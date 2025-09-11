const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const Category = require('../models/Category');
const { publishEvent } = require('../services/eventPublisher');

// Validation middleware
const validateCategory = [
  body('id').notEmpty().withMessage('Category ID is required'),
  body('name').notEmpty().withMessage('Category name is required'),
  body('lifecycleStatus').optional().isIn(['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'])
];

// GET /api/v1/categories - List categories with filtering and pagination
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
      parentId,
      isRoot,
      'validFor.startDateTime.gte': startDateGte,
      'validFor.startDateTime.lte': startDateLte
    } = req.query;

    // Build filter object
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (parentId) filter.parentId = parentId;
    if (isRoot !== undefined) filter.isRoot = isRoot === 'true';
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

    const categories = await Category.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await Category.countDocuments(filter);

    res.json({
      data: categories,
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

// GET /api/v1/categories/:id - Get category by ID
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

    const category = await Category.findOne({ id: req.params.id }, projection);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// GET /api/v1/categories/:id/children - Get child categories
router.get('/:id/children', async (req, res) => {
  try {
    const { fields } = req.query;
    
    let projection = {};
    if (fields) {
      const fieldList = fields.split(',');
      fieldList.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const children = await Category.find({ parentId: req.params.id }, projection);
    
    res.json(children);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// POST /api/v1/categories - Create new category
router.post('/', validateCategory, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/api/v1/categories/${req.body.id}`;
    }

    const category = new Category(req.body);
    await category.save();

    res.status(201).json(category);
    publishEvent('CatalogCategoryCreateEvent', 'Category', category.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Category with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// PATCH /api/v1/categories/:id - Update category
router.patch('/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
    if (category) publishEvent('CatalogCategoryAttributeValueChangeEvent', 'Category', category.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

// DELETE /api/v1/categories/:id - Delete category
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findOneAndDelete({ id: req.params.id });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.status(204).send();
    if (category) publishEvent('CatalogCategoryDeleteEvent', 'Category', category.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
});

module.exports = router;
