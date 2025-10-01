const ProductOfferingPrice = require('../models/ProductOfferingPrice');
const { publishEvent } = require('../services/eventPublisher');

// GET /tmf-api/productCatalog/v5/productOfferingPrice - List product offering prices with filtering and pagination
const listProductOfferingPrices = async (req, res) => {
  try {
    const {
      offset = 0,
      limit = 20,
      fields,
      name,
      lifecycleStatus,
      priceType,
      recurringChargePeriod,
      'validFor.startDateTime.gte': startDateGte,
      'validFor.startDateTime.lte': startDateLte
    } = req.query;

    // Build filter object
    const filter = {};
    if (name) filter.name = new RegExp(name, 'i');
    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (priceType) filter.priceType = priceType;
    if (recurringChargePeriod) filter.recurringChargePeriod = recurringChargePeriod;
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

    const prices = await ProductOfferingPrice.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await ProductOfferingPrice.countDocuments(filter);

    res.json({
      data: prices,
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

// GET /tmf-api/productCatalog/v5/productOfferingPrice/:id - Get product offering price by ID
const getProductOfferingPrice = async (req, res) => {
  try {
    const { fields } = req.query;
    
    let projection = {};
    if (fields) {
      const fieldList = fields.split(',');
      fieldList.forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const price = await ProductOfferingPrice.findOne({ id: req.params.id }, projection);
    
    if (!price) {
      return res.status(404).json({ error: 'Product Offering Price not found' });
    }

    res.json(price);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/productOfferingPrice - Create new product offering price
const createProductOfferingPrice = async (req, res) => {
  try {
    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/productOfferingPrice/${req.body.id}`;
    }

    const price = new ProductOfferingPrice(req.body);
    await price.save();

    res.status(201).json(price);
    publishEvent('ProductOfferingPriceCreateEvent', 'ProductOfferingPrice', price.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Product Offering Price with this ID already exists' });
    }
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// PATCH /tmf-api/productCatalog/v5/productOfferingPrice/:id - Update product offering price
const updateProductOfferingPrice = async (req, res) => {
  try {
    const price = await ProductOfferingPrice.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!price) {
      return res.status(404).json({ error: 'Product Offering Price not found' });
    }

    res.json(price);
    if (price) publishEvent('ProductOfferingPriceAttributeValueChangeEvent', 'ProductOfferingPrice', price.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// DELETE /tmf-api/productCatalog/v5/productOfferingPrice/:id - Delete product offering price
const deleteProductOfferingPrice = async (req, res) => {
  try {
    const price = await ProductOfferingPrice.findOneAndDelete({ id: req.params.id });

    if (!price) {
      return res.status(404).json({ error: 'Product Offering Price not found' });
    }

    res.status(204).send();
    if (price) publishEvent('ProductOfferingPriceDeleteEvent', 'ProductOfferingPrice', price.toObject());
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  listProductOfferingPrices,
  getProductOfferingPrice,
  createProductOfferingPrice,
  updateProductOfferingPrice,
  deleteProductOfferingPrice
};
