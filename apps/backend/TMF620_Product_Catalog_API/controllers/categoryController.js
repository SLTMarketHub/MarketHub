const Category = require('../models/Category');
const { publishEvent } = require('../services/eventPublisher');

// GET /tmf-api/productCatalog/v5/category - List categories with filtering and pagination
const listCategories = async (req, res) => {
  try {
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
};

// GET /tmf-api/productCatalog/v5/category/:id - Get category by ID
const getCategory = async (req, res) => {
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
};

// GET /tmf-api/productCatalog/v5/category/:id/children - Get child categories
const getCategoryChildren = async (req, res) => {
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
};

// POST /tmf-api/productCatalog/v5/category - Create new category
const createCategory = async (req, res) => {
  try {
    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/category/${req.body.id}`;
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
};

// PATCH /tmf-api/productCatalog/v5/category/:id - Update category
const updateCategory = async (req, res) => {
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
};

// DELETE /tmf-api/productCatalog/v5/category/:id - Delete category
const deleteCategory = async (req, res) => {
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
};

module.exports = {
  listCategories,
  getCategory,
  getCategoryChildren,
  createCategory,
  updateCategory,
  deleteCategory
};
