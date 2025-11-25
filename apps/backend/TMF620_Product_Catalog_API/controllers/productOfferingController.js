const ProductOffering = require('../models/ProductOffering');
const { publishEvent } = require('../services/eventPublisher');
const path = require('path');

// Helper function to remove binary data from attachments (keep only metadata)
const sanitizeAttachments = (offeringObj) => {
  if (offeringObj.attachment && Array.isArray(offeringObj.attachment)) {
    offeringObj.attachment = offeringObj.attachment.map(att => {
      const { data, ...attachmentMetadata } = att.toObject ? att.toObject() : att;
      return {
        ...attachmentMetadata,
        href: `/tmf-api/productCatalog/v5/productOffering/${offeringObj.id}/attachments/${att.id || attachmentMetadata.id}`
      };
    });
  }
  return offeringObj;
};

// GET /tmf-api/productCatalog/v5/productOffering - List with filtering & pagination
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

    let projection = {};
    if (fields) {
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productOfferings = await ProductOffering.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await ProductOffering.countDocuments(filter);

    const sanitizedOfferings = productOfferings.map(offering => sanitizeAttachments(offering));

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
    console.error('Error in listProductOfferings:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /tmf-api/productCatalog/v5/productOffering/:id
const getProductOffering = async (req, res) => {
  try {
    const { fields } = req.query;
    let projection = {};
    if (fields) {
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productOffering = await ProductOffering.findOne({ id: req.params.id }, projection).lean();
    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }

    const offeringObj = sanitizeAttachments(productOffering);
    res.json(offeringObj);
  } catch (error) {
    console.error('Error in getProductOffering:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /tmf-api/productCatalog/v5/productOffering/byCategory/:id
const getProductOfferingByCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const {
      offset = 0,
      limit = 20,
      fields,
      lifecycleStatus,
      isSellable,
      'validFor.startDateTime.gte': startDateGte,
      'validFor.startDateTime.lte': startDateLte
    } = req.query;

    const filter = { 'category.id': categoryId };
    if (lifecycleStatus) filter.lifecycleStatus = lifecycleStatus;
    if (isSellable !== undefined) filter.isSellable = isSellable === 'true';
    if (startDateGte || startDateLte) {
      filter['validFor.startDateTime'] = {};
      if (startDateGte) filter['validFor.startDateTime'].$gte = new Date(startDateGte);
      if (startDateLte) filter['validFor.startDateTime'].$lte = new Date(startDateLte);
    }

    let projection = {};
    if (fields) {
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const productOfferings = await ProductOffering.find(filter, projection)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .lean();

    const total = await ProductOffering.countDocuments(filter);
    const sanitizedOfferings = productOfferings.map(offering => sanitizeAttachments(offering));

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
    console.error('Error in getProductOfferingByCategory:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/productOffering
const createProductOffering = async (req, res) => {
  try {
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/productOffering/${req.body.id}`;
    }

    const productOffering = new ProductOffering(req.body);
    await productOffering.save();

    const offeringObj = sanitizeAttachments(productOffering.toObject());
    res.status(201).json(offeringObj);

    publishEvent('ProductOfferingCreateEvent', 'ProductOffering', productOffering.toObject());
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Product Offering with this ID already exists' });
    }
    console.error('Error in createProductOffering:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// PATCH /tmf-api/productCatalog/v5/productOffering/:id
const updateProductOffering = async (req, res) => {
  try {
    const productOffering = await ProductOffering.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    ).lean();

    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }

    const offeringObj = sanitizeAttachments(productOffering);
    res.json(offeringObj);

    publishEvent('ProductOfferingAttributeValueChangeEvent', 'ProductOffering', productOffering);
  } catch (error) {
    console.error('Error in updateProductOffering:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// DELETE /tmf-api/productCatalog/v5/productOffering/:id
const deleteProductOffering = async (req, res) => {
  try {
    const productOffering = await ProductOffering.findOneAndDelete({ id: req.params.id }).lean();
    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }

    res.status(204).send();
    publishEvent('ProductOfferingDeleteEvent', 'ProductOffering', productOffering);
  } catch (error) {
    console.error('Error in deleteProductOffering:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/productOffering/:id/attachments - Upload image
const uploadProductOfferingImage = async (req, res) => {
  try {
    const productOffering = await ProductOffering.findOne({ id: req.params.id });
    if (!productOffering) {
      return res.status(404).json({ error: 'Product Offering not found' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const file = req.file;
    if (!file.buffer || file.buffer.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty file' });
    }

    const imageBuffer = Buffer.from(file.buffer);

    const attachment = {
      id: `${productOffering.id}-att-${Date.now()}`,
      attachmentType: 'image',
      description: file.originalname,
      mimeType: file.mimetype,
      name: file.originalname,
      data: imageBuffer,
      size: { amount: imageBuffer.length, units: 'bytes' },
      '@type': 'Attachment'
    };

    productOffering.attachment = productOffering.attachment || [];
    productOffering.attachment.push(attachment);
    await productOffering.save();

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
    res.status(201).json({ message: 'Image uploaded successfully', attachment: attachmentMetadata });
  } catch (error) {
    console.error('Error in uploadProductOfferingImage:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /tmf-api/productCatalog/v5/productOffering/:id/attachments/:attId - Serve image
const getProductOfferingAttachment = async (req, res) => {
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

    let imageBuffer = Buffer.isBuffer(attachment.data)
      ? attachment.data
      : Buffer.from(attachment.data.buffer || attachment.data);

    res.set({
      "Content-Type": attachment.mimeType || "image/png",
      "Content-Disposition": `inline; filename="${attachment.name || "image"}"`,
      "Content-Length": imageBuffer.length,
      "Cache-Control": "public, max-age=31536000",
      "Access-Control-Allow-Origin": "*"
    });

    res.send(imageBuffer);
  } catch (error) {
    console.error("Error retrieving attachment:", error);
    res.status(500).json({ message: "Error retrieving attachment", error: error.message });
  }
};

// GET /tmf-api/productCatalog/v5/productOffering/all - Get ALL products (safe + performant)
const getAllProductOfferings = async (req, res) => {
  try {
    const { fields, limit } = req.query;

    // CRITICAL: Aggressive limit to prevent timeouts
    const MAX_SAFE_LIMIT = 100;
    const safeLimit = limit ? Math.min(parseInt(limit) || 100, MAX_SAFE_LIMIT) : 50;

    // Build minimal projection - only fetch essential fields
    let projection = {
      id: 1,
      href: 1,
      name: 1,
      description: 1,
      lifecycleStatus: 1,
      isSellable: 1,
      version: 1,
      createdAt: 1,
      'attachment.id': 1,
      'attachment.href': 1,
      'attachment.name': 1,
      'attachment.mimeType': 1,
      'attachment.attachmentType': 1,
      'category.id': 1,
      'category.name': 1
    };

    // If custom fields requested, use them but exclude heavy data
    if (fields) {
      projection = {};
      fields.split(',').forEach(f => {
        const field = f.trim();
        // Always exclude binary data
        if (!field.includes('data') && !field.includes('attachment.data')) {
          projection[field] = 1;
        }
      });
      // Ensure critical fields are always included
      projection.id = 1;
      projection.name = 1;
    }

    console.log(`Fetching up to ${safeLimit} product offerings with minimal projection...`);

    // Set query timeout to 15 seconds
    const productOfferings = await ProductOffering.find({}, projection)
      .limit(safeLimit)
      .sort({ createdAt: -1 })
      .maxTimeMS(15000) // Query timeout
      .lean()
      .exec();

    // Sanitize attachments (removes any leftover binary + adds href)
    const sanitizedOfferings = productOfferings.map(offering => sanitizeAttachments(offering));

    res.json({
      data: sanitizedOfferings,
      total: sanitizedOfferings.length,
      limit: safeLimit,
      maxAllowed: MAX_SAFE_LIMIT,
      retrievedAt: new Date().toISOString(),
      message: "Use paginated endpoints /productOffering?offset=0&limit=20 for better performance and full data access"
    });

  } catch (error) {
    console.error('Error in getAllProductOfferings:', error);
    const timeoutError = error.message.includes('timed out') || error.message.includes('maxTimeMS');
    res.status(timeoutError ? 504 : 500).json({
      error: timeoutError ? 'Request timeout' : 'Failed to retrieve product offerings',
      message: timeoutError 
        ? 'Query exceeded 15s timeout. Try pagination with /productOffering?offset=0&limit=20'
        : error.message,
      suggestion: 'Use the paginated /productOffering endpoint for better performance'
    });
  }
};

// Export all controllers
module.exports = {
  listProductOfferings,
  getProductOffering,
  getProductOfferingByCategory,
  createProductOffering,
  updateProductOffering,
  deleteProductOffering,
  uploadProductOfferingImage,
  getProductOfferingAttachment,
  getAllProductOfferings
};
