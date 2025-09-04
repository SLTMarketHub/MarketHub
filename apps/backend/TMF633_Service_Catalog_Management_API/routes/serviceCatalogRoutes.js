const express = require('express');
const { v4: uuidv4 } = require('uuid');
const ServiceCatalog = require('../models/ServiceCatalog');

const router = express.Router();

/**
 * List all service catalogs
 * GET /serviceCatalog
 */
router.get('/', async (req, res) => {
  try {
    const catalogs = await ServiceCatalog.find();
    res.status(200).json(catalogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Retrieve a specific service catalog
 * GET /serviceCatalog/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const catalog = await ServiceCatalog.findOne({ id: req.params.id });
    if (!catalog) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(200).json(catalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Create a new service catalog
 * POST /serviceCatalog
 */
router.post('/', async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();

    const catalog = new ServiceCatalog({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      lastUpdate: now,
      '@type': req.body['@type'] || 'ServiceCatalog'
    });

    await catalog.save();
    res.status(201).json(catalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Patch (update partially) a service catalog
 * PATCH /serviceCatalog/:id
 */
router.patch('/:id', async (req, res) => {
  try {
    const { id, href, ...updates } = req.body; // prevent overwriting id/href
    const updated = await ServiceCatalog.findOneAndUpdate(
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
 * Delete a service catalog
 * DELETE /serviceCatalog/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ServiceCatalog.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(204).send(); // No Content
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

module.exports = router;
