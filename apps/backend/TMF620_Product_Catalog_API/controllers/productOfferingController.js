const ProductOffering = require('../models/ProductOffering');
const { publishEvent } = require('../services/eventPublisher');
const path = require('path');

// Helper function to remove binary data from attachments (keep only metadata)
const sanitizeAttachments = (offeringObj) => {
  if (offeringObj.attachment && Array.isArray(offeringObj.attachment)) {
    offeringObj.attachment = offeringObj.attachment.map(att => {
      const { data, ...attachmentMetadata } = att;
      return {
        ...attachmentMetadata,
        href: `/tmf-api/productCatalog/v5/productOffering/${offeringObj.id}/attachments/${att.id}`
      };
    });
  }
  return offeringObj;
};

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

    // Remove binary data from attachments in response (keep only metadata)
    const sanitizedOfferings = productOfferings.map(offering => {
      const offeringObj = offering.toObject();
      return sanitizeAttachments(offeringObj);
    });

    res.json({
      data: sanitizedOfferings,
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

    // Remove binary data from attachments in response (keep only metadata)
    const offeringObj = sanitizeAttachments(productOffering.toObject());
    res.json(offeringObj);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /tmf-api/productCatalog/v5/productOffering/byCategory/:id - Get product offerings by Category
const getProductOfferingByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const {
      offset = 0,
      limit = 0,
      fields,
      lifecycleStatus,
      isSellable,
      'validFor.startDateTime.gte': startDateGte,
      'validFor.startDateTime.lte': startDateLte
    } = req.query;

    // Build filter object
    const filter = {
      'category.id': categoryId
    };
    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (isSellable !== undefined) filter.isSellable = isSellable === 'true';
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

    // Remove binary data from attachments
    const sanitizedOfferings = productOfferings.map(offering => {
      const offeringObj = offering.toObject();
      return sanitizeAttachments(offeringObj);
    });

    res.json({
      data: sanitizedOfferings,
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

// POST /tmf-api/productCatalog/v5/productOffering - Create new product offering
const createProductOffering = async (req, res) => {
  try {
    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/productOffering/${req.body.id}`;
    }

    const productOffering = new ProductOffering(req.body);
    await productOffering.save();

    // Remove binary data from attachments in response (keep only metadata)
    const offeringObj = sanitizeAttachments(productOffering.toObject());
    res.status(201).json(offeringObj);
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

    // Remove binary data from attachments in response (keep only metadata)
    const offeringObj = sanitizeAttachments(productOffering.toObject());
    res.json(offeringObj);
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
  getProductOfferingByCategory,
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
      
      // Validate file buffer exists and has data
      if (!file.buffer || !Buffer.isBuffer(file.buffer)) {
        return res.status(400).json({ error: 'Invalid file data' });
      }

      if (file.buffer.length === 0) {
        return res.status(400).json({ error: 'File is empty' });
      }

      // Ensure buffer is properly formatted
      const imageBuffer = Buffer.isBuffer(file.buffer) ? file.buffer : Buffer.from(file.buffer);

      const attachment = {
        id: `${productOffering.id}-att-${Date.now()}`,
        attachmentType: 'image',
        description: file.originalname,
        mimeType: file.mimetype,
        name: file.originalname,
        data: imageBuffer, // Store binary data directly in MongoDB as Buffer
        size: {
          amount: imageBuffer.length, // Use actual buffer length
          units: 'bytes'
        },
        '@type': 'Attachment'
      };

      productOffering.attachment = productOffering.attachment || [];
      productOffering.attachment.push(attachment);
      await productOffering.save();

      // Verify data was saved correctly (optional - for debugging)
      const savedOffering = await ProductOffering.findOne({ id: req.params.id }).select('+attachment.data');
      const savedAttachment = savedOffering.attachment.find(a => a.id === attachment.id);
      if (savedAttachment && savedAttachment.data) {
        const dataLength = Buffer.isBuffer(savedAttachment.data) 
          ? savedAttachment.data.length 
          : (savedAttachment.data.buffer ? savedAttachment.data.buffer.length : 0);
        if (dataLength === 0) {
          console.warn('Warning: Image data may not have been saved correctly to database');
        }
      }

      // Return attachment metadata only (exclude binary data)
      const attachmentMetadata = {
        id: attachment.id,
        attachmentType: attachment.attachmentType,
        description: attachment.description,
        mimeType: attachment.mimeType,
        name: attachment.name,
        size: attachment.size,
        '@type': attachment['@type'],
        href: `/tmf-api/productCatalog/v5/productOffering/${productOffering.id}/attachments/${attachment.id}`
      };

      publishEvent('ProductOfferingAttributeValueChangeEvent', 'ProductOffering', productOffering.toObject());
      res.status(201).json({ message: 'Image uploaded', attachment: attachmentMetadata });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error', message: error.message });
    }
  },

// GET /tmf-api/productCatalog/v5/productOffering/:id/attachments/:attId
getProductOfferingAttachment: async (req, res) => {
  try {
    const { id, attId } = req.params;
    const productOffering = await ProductOffering.findOne({ id }).select('+attachment.data');
    if (!productOffering) {
      return res.status(404).json({ message: "Product offering not found" });
    }

    const attachment = (productOffering.attachment || []).find(a => a.id === attId);
    if (!attachment || !attachment.data) {
      return res.status(404).json({ message: "Attachment not found" });
    }

    // ✅ Ensure data is in Buffer format
    let imageBuffer;
    if (Buffer.isBuffer(attachment.data)) {
      imageBuffer = attachment.data;
    } else if (attachment.data && attachment.data.buffer) {
      imageBuffer = Buffer.from(attachment.data.buffer);
    } else if (typeof attachment.data === "string") {
      imageBuffer = Buffer.from(attachment.data, "base64");
    } else {
      imageBuffer = Buffer.from(attachment.data);
    }

    // Set CORS headers to allow image retrieval from any origin
    res.set("Access-Control-Allow-Origin", "*"); // Allow all origins for images
    res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    
    // Set image-specific headers
    res.set("Content-Type", attachment.mimeType || "image/png");
    res.set("Content-Disposition", `inline; filename="${attachment.name || "image"}"`);
    res.set("Content-Length", imageBuffer.length);
    res.set("Cache-Control", "public, max-age=31536000"); // Cache for 1 year
    
    res.send(imageBuffer);
  } catch (error) {
    console.error("Error retrieving attachment:", error);
    res.status(500).json({ message: "Error retrieving attachment", error: error.message });
  }
},

};

