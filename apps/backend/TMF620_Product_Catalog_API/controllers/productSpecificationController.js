const ProductSpecification = require('../models/ProductSpecification');
const { publishEvent } = require('../services/eventPublisher');

// GET /tmf-api/productCatalog/v5/productSpecification - List product specifications with filtering and pagination
const listProductSpecifications = async (req, res) => {
  try {
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

    const productSpecifications = await ProductSpecification.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ProductSpecification.countDocuments(filter);

    res.json({
      data: productSpecifications,
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

// GET /tmf-api/productCatalog/v5/productSpecification/:id - Get product specification by ID
const getProductSpecification = async (req, res) => {
  try {
    const { fields } = req.query;
    
    let projection = {};
    if (fields) {
      const fieldList = fields.split(',');
      fieldList.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productSpecification = await ProductSpecification.findOne({ id: req.params.id }, projection);
    
    if (!productSpecification) {
      return res.status(404).json({ error: 'Product Specification not found' });
    }

    res.json(productSpecification);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/productSpecification - Create new product specification
const createProductSpecification = async (req, res) => {
  try {
    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/productSpecification/${req.body.id}`;
    }

    const productSpecification = new ProductSpecification(req.body);
    await productSpecification.save();

    res.status(201).json(productSpecification);
    publishEvent('ProductSpecificationCreateEvent', 'ProductSpecification', productSpecification.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Product Specification with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// PATCH /tmf-api/productCatalog/v5/productSpecification/:id - Update product specification
const updateProductSpecification = async (req, res) => {
  try {
    const productSpecification = await ProductSpecification.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!productSpecification) {
      return res.status(404).json({ error: 'Product Specification not found' });
    }

    res.json(productSpecification);
    if (productSpecification) publishEvent('ProductSpecificationAttributeValueChangeEvent', 'ProductSpecification', productSpecification.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// DELETE /tmf-api/productCatalog/v5/productSpecification/:id - Delete product specification
const deleteProductSpecification = async (req, res) => {
  try {
    const productSpecification = await ProductSpecification.findOneAndDelete({ id: req.params.id });

    if (!productSpecification) {
      return res.status(404).json({ error: 'Product Specification not found' });
    }

    res.status(204).send();
    if (productSpecification) publishEvent('ProductSpecificationDeleteEvent', 'ProductSpecification', productSpecification.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  listProductSpecifications,
  getProductSpecification,
  createProductSpecification,
  updateProductSpecification,
  deleteProductSpecification
};
