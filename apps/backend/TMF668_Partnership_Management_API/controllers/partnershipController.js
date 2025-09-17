// partnershipController.js
// Controller functions for Partnership resource

const Partnership = require('../models/Partnership');

// Create a new Partnership
exports.createPartnership = async (req, res) => {
  try {
    const partnership = new Partnership(req.body);
    const savedPartnership = await partnership.save();
    res.status(201).json(savedPartnership);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message });
  }
};

// Get all Partnerships
exports.getAllPartnerships = async (req, res) => {
  try {
    const partnerships = await Partnership.find();
    res.json(partnerships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a Partnership by ID
exports.getPartnershipById = async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Not found' });
    res.json(partnership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a Partnership by ID
exports.updatePartnership = async (req, res) => {
  try {
    const updatedPartnership = await Partnership.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedPartnership) return res.status(404).json({ error: 'Not found' });
    res.json(updatedPartnership);
  } catch (err) {
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message });
  }
};

// Delete a Partnership by ID
exports.deletePartnership = async (req, res) => {
  try {
    const deletedPartnership = await Partnership.findByIdAndDelete(req.params.id);
    if (!deletedPartnership) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
