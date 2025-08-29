const ProductOffering = require('../models/ProductOffering');
const { v4: uuidv4 } = require('uuid');

// Helper to safely include optional object fields
function includeIfObject(field) {
  return (field && typeof field === 'object') ? field : undefined;
}

// Create ProductOffering
exports.createOffering = async (req, res) => {
  try {
    // Ensure mandatory fields including @type and id
    if (!req.body['@type']) return res.status(400).json({ error: '@type is required' });

    // If id not provided, generate one
    const id = req.body.id || uuidv4();

    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const href = `${baseUrl}/api/productOffering/${id}`;

    // Build offering data to save
    const data = {
      ...req.body,
      id,
      href,
      lastUpdate: req.body.lastUpdate ? new Date(req.body.lastUpdate) : new Date(),
      lifecycleStatus: req.body.lifecycleStatus || 'Active',
    };

    // Validate mandatory fields (id, name, @type, lastUpdate, lifecycleStatus)
    const mandatoryFields = ['id', 'name', '@type', 'lastUpdate', 'lifecycleStatus'];
    for (const field of mandatoryFields) {
      if (!data[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Save to DB
    const offering = new ProductOffering(data);
    await offering.save();

    // Build response object with required and optional fields
    const response = {
      id: offering.id,
      href: offering.href,
      '@type': offering['@type'],
      name: offering.name,
      lastUpdate: offering.lastUpdate.toISOString(),
      lifecycleStatus: offering.lifecycleStatus,
      description: offering.description,
      isBundle: offering.isBundle,
      isSellable: offering.isSellable,
      statusReason: offering.statusReason,
      version: offering.version,
      validFor: includeIfObject(offering.validFor),
      productOfferingPrice: Array.isArray(offering.productOfferingPrice) ? offering.productOfferingPrice : undefined,
      productOfferingTerm: Array.isArray(offering.productOfferingTerm) ? offering.productOfferingTerm : undefined,
      productSpecification: includeIfObject(offering.productSpecification),
      bundledProductOffering: Array.isArray(offering.bundledProductOffering) ? offering.bundledProductOffering : undefined,
      place: Array.isArray(offering.place) ? offering.place : undefined,
      policy: Array.isArray(offering.policy) ? offering.policy : undefined,
      channel: Array.isArray(offering.channel) ? offering.channel : undefined,
      category: Array.isArray(offering.category) ? offering.category : undefined,
      agreement: Array.isArray(offering.agreement) ? offering.agreement : undefined,
      attachment: Array.isArray(offering.attachment) ? offering.attachment : undefined,
      serviceCandidate: includeIfObject(offering.serviceCandidate),
      resourceCandidate: includeIfObject(offering.resourceCandidate),
      serviceLevelAgreement: includeIfObject(offering.serviceLevelAgreement),
      externalIdentifier: offering.externalIdentifier,
      allowedAction: Array.isArray(offering.allowedAction) ? offering.allowedAction : undefined,
      marketSegment: Array.isArray(offering.marketSegment) ? offering.marketSegment : undefined,
      productOfferingRelationship: Array.isArray(offering.productOfferingRelationship) ? offering.productOfferingRelationship : undefined,
      prodSpecCharValueUse: Array.isArray(offering.prodSpecCharValueUse) ? offering.prodSpecCharValueUse : undefined
    };

    // Remove keys with undefined values to keep response clean
    Object.keys(response).forEach(key => response[key] === undefined && delete response[key]);

    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All ProductOfferings
exports.getOfferings = async (req, res) => {
  try {
    const offerings = await ProductOffering.find();
    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = offerings.map(o => ({
      id: o.id,
      href: `${baseUrl}/api/productOffering/${o.id}`,
      '@type': o['@type'],
      name: o.name,
      lastUpdate: o.lastUpdate?.toISOString(),
      lifecycleStatus: o.lifecycleStatus
    }));

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get ProductOffering by ID
exports.getOfferingById = async (req, res) => {
  const { id } = req.params;
  if (!id || id === 'undefined') {
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  try {
    const offering = await ProductOffering.findOne({ id });
    if (!offering) return res.status(404).json({ error: 'ProductOffering not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = {
      id: offering.id,
      href: `${baseUrl}/api/productOffering/${offering.id}`,
      '@type': offering['@type'],
      lastUpdate: offering.lastUpdate?.toISOString(),
      lifecycleStatus: offering.lifecycleStatus,
      name: offering.name,
      description: offering.description,
      isBundle: offering.isBundle,
      isSellable: offering.isSellable,
      statusReason: offering.statusReason,
      version: offering.version,
      validFor: includeIfObject(offering.validFor),
      productOfferingPrice: Array.isArray(offering.productOfferingPrice) ? offering.productOfferingPrice : undefined,
      productOfferingTerm: Array.isArray(offering.productOfferingTerm) ? offering.productOfferingTerm : undefined,
      productSpecification: includeIfObject(offering.productSpecification),
      bundledProductOffering: Array.isArray(offering.bundledProductOffering) ? offering.bundledProductOffering : undefined,
      place: Array.isArray(offering.place) ? offering.place : undefined,
      policy: Array.isArray(offering.policy) ? offering.policy : undefined,
      channel: Array.isArray(offering.channel) ? offering.channel : undefined,
      category: Array.isArray(offering.category) ? offering.category : undefined,
      agreement: Array.isArray(offering.agreement) ? offering.agreement : undefined,
      attachment: Array.isArray(offering.attachment) ? offering.attachment : undefined,
      serviceCandidate: includeIfObject(offering.serviceCandidate),
      resourceCandidate: includeIfObject(offering.resourceCandidate),
      serviceLevelAgreement: includeIfObject(offering.serviceLevelAgreement),
      externalIdentifier: offering.externalIdentifier,
      allowedAction: Array.isArray(offering.allowedAction) ? offering.allowedAction : undefined,
      marketSegment: Array.isArray(offering.marketSegment) ? offering.marketSegment : undefined,
      productOfferingRelationship: Array.isArray(offering.productOfferingRelationship) ? offering.productOfferingRelationship : undefined,
      prodSpecCharValueUse: Array.isArray(offering.prodSpecCharValueUse) ? offering.prodSpecCharValueUse : undefined
    };

    Object.keys(response).forEach(key => response[key] === undefined && delete response[key]);

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update ProductOffering
exports.updateOffering = async (req, res) => {
  try {
    const updates = {
      ...req.body,
      lastUpdate: req.body.lastUpdate ? new Date(req.body.lastUpdate) : new Date(),
      '@type': req.body['@type'] || 'ProductOffering',
      lifecycleStatus: req.body.lifecycleStatus || 'Active'
    };

    const updated = await ProductOffering.findOneAndUpdate(
      { id: req.params.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: 'ProductOffering not found' });

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    const response = {
      id: updated.id,
      href: `${baseUrl}/api/productOffering/${updated.id}`,
      '@type': updated['@type'],
      name: updated.name,
      lastUpdate: updated.lastUpdate?.toISOString(),
      lifecycleStatus: updated.lifecycleStatus,
      description: updated.description,
      isBundle: updated.isBundle,
      isSellable: updated.isSellable,
      statusReason: updated.statusReason,
      version: updated.version,
      validFor: includeIfObject(updated.validFor),
      productOfferingPrice: Array.isArray(updated.productOfferingPrice) ? updated.productOfferingPrice : undefined,
      productOfferingTerm: Array.isArray(updated.productOfferingTerm) ? updated.productOfferingTerm : undefined,
      productSpecification: includeIfObject(updated.productSpecification),
      bundledProductOffering: Array.isArray(updated.bundledProductOffering) ? updated.bundledProductOffering : undefined,
      place: Array.isArray(updated.place) ? updated.place : undefined,
      policy: Array.isArray(updated.policy) ? updated.policy : undefined,
      channel: Array.isArray(updated.channel) ? updated.channel : undefined,
      category: Array.isArray(updated.category) ? updated.category : undefined,
      agreement: Array.isArray(updated.agreement) ? updated.agreement : undefined,
      attachment: Array.isArray(updated.attachment) ? updated.attachment : undefined,
      serviceCandidate: includeIfObject(updated.serviceCandidate),
      resourceCandidate: includeIfObject(updated.resourceCandidate),
      serviceLevelAgreement: includeIfObject(updated.serviceLevelAgreement),
      externalIdentifier: updated.externalIdentifier,
      allowedAction: Array.isArray(updated.allowedAction) ? updated.allowedAction : undefined,
      marketSegment: Array.isArray(updated.marketSegment) ? updated.marketSegment : undefined,
      productOfferingRelationship: Array.isArray(updated.productOfferingRelationship) ? updated.productOfferingRelationship : undefined,
      prodSpecCharValueUse: Array.isArray(updated.prodSpecCharValueUse) ? updated.prodSpecCharValueUse : undefined
    };

    Object.keys(response).forEach(key => response[key] === undefined && delete response[key]);

    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete ProductOffering
exports.deleteOffering = async (req, res) => {
  try {
    const deleted = await ProductOffering.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'ProductOffering not found' });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
