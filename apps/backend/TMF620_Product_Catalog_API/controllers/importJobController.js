const ImportJob = require('../models/ImportJob');
const { v4: uuidv4 } = require('uuid');

// GET /tmf-api/productCatalog/v5/importJob - List import jobs
const listImportJobs = async (req, res) => {
  try {
    const { offset = 0, limit = 20, status, contentType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (contentType) filter.contentType = contentType;
    
    const data = await ImportJob.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ creationDate: -1 });
    
    const total = await ImportJob.countDocuments(filter);
    
    res.json({
      data,
      pagination: {
        offset: parseInt(offset),
        limit: parseInt(limit),
        total,
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// GET /tmf-api/productCatalog/v5/importJob/:id - Get import job by ID
const getImportJob = async (req, res) => {
  try {
    const importJob = await ImportJob.findOne({ id: req.params.id });
    
    if (!importJob) {
      return res.status(404).json({ error: 'Import Job not found' });
    }

    res.json(importJob);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/importJob - Create new import job
const createImportJob = async (req, res) => {
  try {
    // Generate ID if not provided
    if (!req.body.id) {
      req.body.id = uuidv4();
    }

    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/importJob/${req.body.id}`;
    }

    // Set default content type if not provided
    if (!req.body.contentType) {
      req.body.contentType = 'application/json';
    }

    const importJob = new ImportJob(req.body);
    await importJob.save();

    res.status(201).json(importJob);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Import Job with this ID already exists' });
    }
    res.status(400).json({ error: 'Bad request', message: error.message });
  }
};

// PATCH /tmf-api/productCatalog/v5/importJob/:id - Update import job
const updateImportJob = async (req, res) => {
  try {
    const importJob = await ImportJob.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!importJob) {
      return res.status(404).json({ error: 'Import Job not found' });
    }

    res.json(importJob);
  } catch (error) {
    res.status(400).json({ error: 'Bad request', message: error.message });
  }
};

// DELETE /tmf-api/productCatalog/v5/importJob/:id - Delete import job
const deleteImportJob = async (req, res) => {
  try {
    const importJob = await ImportJob.findOneAndDelete({ id: req.params.id });

    if (!importJob) {
      return res.status(404).json({ error: 'Import Job not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/importJob/:id/start - Start import job execution
const startImportJob = async (req, res) => {
  try {
    const importJob = await ImportJob.findOne({ id: req.params.id });

    if (!importJob) {
      return res.status(404).json({ error: 'Import Job not found' });
    }

    if (importJob.status !== 'notStarted') {
      return res.status(400).json({ error: 'Import Job cannot be started', message: `Current status: ${importJob.status}` });
    }

    // Update status to running
    importJob.status = 'running';
    await importJob.save();

    // Here you would implement the actual import logic
    // For now, we'll simulate the process
    setTimeout(async () => {
      try {
        // Simulate import process completion
        importJob.status = 'succeeded';
        importJob.completionDate = new Date();
        await importJob.save();
      } catch (error) {
        importJob.status = 'failed';
        importJob.errorLog = error.message;
        importJob.completionDate = new Date();
        await importJob.save();
      }
    }, 5000); // Simulate 5 second processing time

    res.json({
      message: 'Import job started successfully',
      job: importJob
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  listImportJobs,
  getImportJob,
  createImportJob,
  updateImportJob,
  deleteImportJob,
  startImportJob
};
