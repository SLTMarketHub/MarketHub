const express = require('express');
const router = express.Router();
const ExportJob = require('../models/ExportJob');

// POST
router.post('/', async (req, res) => {
  try {
    const job = new ExportJob(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET all / filters
router.get('/', async (req, res) => {
  try {
    let query = {};
    if (req.query.id) query._id = req.query.id;
    if (req.query.status) query.status = req.query.status;
    const jobs = await ExportJob.find(query);
    res.json(jobs);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET by ID
router.get('/:id', async (req, res) => {
  try {
    const job = await ExportJob.findById(req.params.id);
    if (!job) return res.status(404).json({ code: 'NotFound', message: 'ExportJob not found' });
    res.json(job);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

module.exports = router;
