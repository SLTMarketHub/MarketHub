const express = require('express');
const { v4: uuidv4 } = require('uuid');
const ImportJob = require('../models/ImportJob');

const router = express.Router();

/**
 * List import jobs
 * GET /importJob
 */
router.get('/', async (req, res) => {
  try {
    const jobs = await ImportJob.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Retrieve a specific import job
 * GET /importJob/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const job = await ImportJob.findOne({ id: req.params.id });
    if (!job) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Create a new import job
 * POST /importJob
 */
router.post('/', async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();
    const job = new ImportJob({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      creationDate: now,
      status: req.body.status || 'InProgress',
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

/**
 * Delete an import job
 * DELETE /importJob/:id
 */
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await ImportJob.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
});

module.exports = router;
