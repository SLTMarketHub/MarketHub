const express = require('express');
const router = express.Router();
const ServiceCatalog = require('../models/ServiceCatalog');

// POST
router.post('/', async (req, res) => {
  try {
    const catalog = new ServiceCatalog(req.body);
    await catalog.save();
    res.status(201).json(catalog);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET with filters
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.id) query._id = req.query.id;
    if (req.query.name) query.name = req.query.name;
    if (req.query.lifecycleStatus) query.lifecycleStatus = req.query.lifecycleStatus;
    const catalogs = await ServiceCatalog.find(query);
    res.json(catalogs);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const catalog = await ServiceCatalog.findById(req.params.id);
    if (!catalog) return res.status(404).json({ code: 'NotFound', message: 'ServiceCatalog not found' });
    res.json(catalog);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

module.exports = router;
