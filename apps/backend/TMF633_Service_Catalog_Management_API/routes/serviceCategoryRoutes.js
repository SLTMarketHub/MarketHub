const express = require('express');
const router = express.Router();
const ServiceCategory = require('../models/ServiceCategory');

// POST
router.post('/', async (req, res) => {
  try {
    const category = new ServiceCategory(req.body);
    await category.save();
    res.status(201).json(category);
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
    const categories = await ServiceCategory.find(query);
    res.json(categories);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const category = await ServiceCategory.findById(req.params.id);
    if (!category) return res.status(404).json({ code: 'NotFound', message: 'ServiceCategory not found' });
    res.json(category);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

module.exports = router;
