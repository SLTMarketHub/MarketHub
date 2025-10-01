const ProductOffering = require('../models/ProductOffering');
const { publishEvent } = require('../services/eventPublisher');
const path = require('path');

// GET /tmf-api/productCatalog/v5/productOffering - List product offerings with filtering and pagination
const listProductOfferings = async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 20,
      fields,
      name,
      lifecycleStatus,
      isSellable,
      'category.id': categoryId,
      'validFor.startDateTime.gte': startDateGte,
      'validFor.startDateTime.lte': startDateLte
    } = req.query;

    // Build filter object
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (isSellable !== undefined) filter.isSellable = isSellable === 'true';
    if (categoryId) filter['category.id'] = categoryId;
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

    const productOfferings = await ProductOffering.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ProductOffering.countDocuments(filter);

    res.json({
      data: productOfferings,
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

// GET /tmf-api/productCatalog/v5/productOffering/:id - Get product offering by ID
const getProductOffering = async (req, res) => {
  try {
    const { fields } = req.query;
    
    let projection = {};
    if (fields) {
      const fieldList = fields.split(',');
      fieldList.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productOffering = await ProductOffering.findOne({ id: req.params.id }, projection);
    
    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }

    res.json(productOffering);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/productOffering - Create new product offering
const createProductOffering = async (req, res) => {
  try {
    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/productOffering/${req.body.id}`;
    }

    const productOffering = new ProductOffering(req.body);
    await productOffering.save();

    res.status(201).json(productOffering);
    publishEvent('ProductOfferingCreateEvent', 'ProductOffering', productOffering.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Product Offering with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// PATCH /tmf-api/productCatalog/v5/productOffering/:id - Update product offering
const updateProductOffering = async (req, res) => {
  try {
    const productOffering = await ProductOffering.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }

    res.json(productOffering);
    if (productOffering) publishEvent('ProductOfferingAttributeValueChangeEvent', 'ProductOffering', productOffering.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// DELETE /tmf-api/productCatalog/v5/productOffering/:id - Delete product offering
const deleteProductOffering = async (req, res) => {
  try {
    const productOffering = await ProductOffering.findOneAndDelete({ id: req.params.id });

    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }

    res.status(204).send();
    if (productOffering) publishEvent('ProductOfferingDeleteEvent', 'ProductOffering', productOffering.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  listProductOfferings,
  getProductOffering,
  createProductOffering,
  updateProductOffering,
  deleteProductOffering,
  // POST /tmf-api/productCatalog/v5/productOffering/:id/attachments
  uploadProductOfferingImage: async (req, res) => {
    try {
      const productOffering = await ProductOffering.findOne({ id: req.params.id });
      if (!productOffering) {
        return res.status(404).json({ error: 'Product Offering not found' });
      }

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const file = req.file;
      const publicUrl = `/uploads/${path.basename(file.path)}`;

      const attachment = {
        id: `${productOffering.id}-att-${Date.now()}`,
        href: publicUrl,
        attachmentType: 'image',
        content: undefined,
        description: file.originalname,
        mimeType: file.mimetype,
        name: file.originalname,
        url: publicUrl,
        size: {
          amount: file.size,
          units: 'bytes'
        },
        '@type': 'Attachment',
        '@schemaLocation': ''
      };

      productOffering.attachment = productOffering.attachment || [];
      productOffering.attachment.push(attachment);
      await productOffering.save();

      publishEvent('ProductOfferingAttributeValueChangeEvent', 'ProductOffering', productOffering.toObject());
      res.status(201).json({ message: 'Image uploaded', attachment });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  }
};
