// partnershipSpecification.js
// Express routes for TMF668 PartnershipSpecification resource

const express = require('express');
const router = express.Router();
const PartnershipSpecification = require('../models/PartnershipSpecification');

// CREATE: Add a new PartnershipSpecification
// POST /partnershipSpecification
router.post('/', async (req, res) => {
  try {
    // Create a new PartnershipSpecification from request body
    const spec = new PartnershipSpecification(req.body);
    const savedSpec = await spec.save();
    res.status(201).json(savedSpec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ: Get all PartnershipSpecifications
// GET /partnershipSpecification
router.get('/', async (req, res) => {
  try {
    const specs = await PartnershipSpecification.find();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: Get a PartnershipSpecification by ID
// GET /partnershipSpecification/:id
router.get('/:id', async (req, res) => {
  try {
    const spec = await PartnershipSpecification.findById(req.params.id);
    if (!spec) return res.status(404).json({ error: 'Not found' });
    res.json(spec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Patch a PartnershipSpecification by ID
// PATCH /partnershipSpecification/:id
router.patch('/:id', async (req, res) => {
  try {
    // Only update provided fields
    const updatedSpec = await PartnershipSpecification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedSpec) return res.status(404).json({ error: 'Not found' });
    res.json(updatedSpec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a PartnershipSpecification by ID
// DELETE /partnershipSpecification/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedSpec = await PartnershipSpecification.findByIdAndDelete(req.params.id);
    if (!deletedSpec) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
