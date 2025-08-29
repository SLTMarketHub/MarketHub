const ImportJob = require('../models/importJob');

// Create Import Job
exports.createImportJob = async (req, res) => {
  try {
    const job = new ImportJob(req.body);
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all Import Jobs
exports.getImportJobs = async (req, res) => {
  const jobs = await ImportJob.find();
  res.json(jobs);
};

// Get Import Job by ID
exports.getImportJobById = async (req, res) => {
  const job = await ImportJob.findOne({ id: req.params.id });
  if (!job) return res.status(404).json({ error: 'ImportJob not found' });
  res.json(job);
};

// Delete Import Job
exports.deleteImportJob = async (req, res) => {
  await ImportJob.deleteOne({ id: req.params.id });
  res.status(204).send();
};
