const ExportJob = require('../models/exportJob');

// Create Export Job
exports.createExportJob = async (req, res) => {
  try {
    const job = new ExportJob(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Export Jobs
exports.getExportJobs = async (req, res) => {
  const jobs = await ExportJob.find();
  res.json(jobs);
};

// Get Export Job by ID
exports.getExportJobById = async (req, res) => {
  const job = await ExportJob.findOne({ id: req.params.id });
  if (!job) return res.status(404).json({ error: 'ExportJob not found' });
  res.json(job);
};

// Delete Export Job
exports.deleteExportJob = async (req, res) => {
  await ExportJob.deleteOne({ id: req.params.id });
  res.status(204).send();
};
