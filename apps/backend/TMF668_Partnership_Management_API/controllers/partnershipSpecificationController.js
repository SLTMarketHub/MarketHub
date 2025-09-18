// partnershipSpecificationController.js
// Controller functions for PartnershipSpecification resource

const PartnershipSpecification = require('../models/PartnershipSpecification');

// Create a new PartnershipSpecification
exports.createPartnershipSpecification = async (req, res) => {
  try {
    const spec = new PartnershipSpecification(req.body);
    const savedSpec = await spec.save();
    res.status(201).json(savedSpec);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message });
  }
};

// Get all PartnershipSpecifications
exports.getAllPartnershipSpecifications = async (req, res) => {
  try {
    const specs = await PartnershipSpecification.find();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a PartnershipSpecification by ID
exports.getPartnershipSpecificationById = async (req, res) => {
  try {
    const spec = await PartnershipSpecification.findById(req.params.id);
    if (!spec) return res.status(404).json({ error: 'Not found' });
    res.json(spec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a PartnershipSpecification by ID
exports.updatePartnershipSpecification = async (req, res) => {
  try {
    const updatedSpec = await PartnershipSpecification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedSpec) return res.status(404).json({ error: 'Not found' });
    res.json(updatedSpec);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message });
  }
};

// Delete a PartnershipSpecification by ID
exports.deletePartnershipSpecification = async (req, res) => {
  try {
    const deletedSpec = await PartnershipSpecification.findByIdAndDelete(req.params.id);
    if (!deletedSpec) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
