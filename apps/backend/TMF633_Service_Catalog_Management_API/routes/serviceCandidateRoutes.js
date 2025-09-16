const express = require('express');
const router = express.Router();
const ServiceCandidate = require('../models/ServiceCandidate');

// POST
router.post('/', async (req, res) => {
  try {
    const candidate = new ServiceCandidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
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
    const candidates = await ServiceCandidate.find(query);
    res.json(candidates);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const candidate = await ServiceCandidate.findById(req.params.id);
    if (!candidate) return res.status(404).json({ code: 'NotFound', message: 'ServiceCandidate not found' });
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

module.exports = router;
