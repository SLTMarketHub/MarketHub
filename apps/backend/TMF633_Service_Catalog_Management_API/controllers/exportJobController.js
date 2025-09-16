const { v4: uuidv4 } = require('uuid');
const ExportJob = require('../models/ExportJob');

// List all export jobs
exports.list = async (req, res) => {
  try {
    const jobs = await ExportJob.find();
    res.status(200).json(jobs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Retrieve a specific export job
exports.getById = async (req, res) => {
  try {
    const job = await ExportJob.findOne({ id: req.params.id });
    if (!job) {
      return res.status(404).json({ code: 404, error: 'Not found' });
    }
    res.status(200).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Create a new export job
exports.create = async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();
    const job = new ExportJob({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      creationDate: now,
      status: req.body.status || 'InProgress'
    });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Delete an export job
exports.remove = async (req, res) => {
  try {
    const deleted = await ExportJob.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ code: 404, error: 'Not found' });
    }
    res.status(204).send(); // No content
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};
