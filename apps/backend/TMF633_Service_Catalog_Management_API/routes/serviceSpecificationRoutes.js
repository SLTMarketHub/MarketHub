const express = require('express');
const { v4: uuidv4 } = require('uuid');
const ServiceSpecification = require('../models/ServiceSpecification');

const router = express.Router();

/**
 * List service specifications
 * GET /serviceSpecification
 */
router.get('/', async (req, res) => {
  try {
    const specs = await ServiceSpecification.find();
    res.status(200).json(specs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Retrieve a service specification by ID
 * GET /serviceSpecification/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const spec = await ServiceSpecification.findOne({ id: req.params.id });
    if (!spec) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(200).json(spec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Create a new service specification
 * POST /serviceSpecification
 */
router.post('/', async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();
    const spec = new ServiceSpecification({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      lastUpdate: now,
    });
    await spec.save();
    res.status(201).json(spec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Patch (update partially) a service specification
 * PATCH /serviceSpecification/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id, href, ...updates } = req.body; // prevent overwriting id/href
    const updated = await ServiceSpecification.findOneAndUpdate(
      { id: req.params.id },
      { ...updates, lastUpdate: new Date().toISOString() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ code: 404, error: 'Not found' });

    updated.href = `${req.protocol}://${req.get('host')}${req.baseUrl}/${updated.id}`;
    await updated.save();

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Delete a service specification
 * DELETE /serviceSpecification/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ServiceSpecification.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

module.exports = router;
