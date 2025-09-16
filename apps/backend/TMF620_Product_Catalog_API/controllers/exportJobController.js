const ExportJob = require('../models/ExportJob');
const { v4: uuidv4 } = require('uuid');

// GET /tmf-api/productCatalog/v5/exportJob - List export jobs
const listExportJobs = async (req, res) => {
  try {
    const { offset = 0, limit = 20, status, contentType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (contentType) filter.contentType = contentType;
    
    const data = await ExportJob.find(filter)
      .skip(parseInt(offset))
      .limit(parseInt(limit))
      .sort({ creationDate: -1 });
    
    const total = await ExportJob.countDocuments(filter);
    
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

// GET /tmf-api/productCatalog/v5/exportJob/:id - Get export job by ID
const getExportJob = async (req, res) => {
  try {
    const exportJob = await ExportJob.findOne({ id: req.params.id });
    
    if (!exportJob) {
      return res.status(404).json({ error: 'Export Job not found' });
    }

    res.json(exportJob);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/exportJob - Create new export job
const createExportJob = async (req, res) => {
  try {
    // Generate ID if not provided
    if (!req.body.id) {
      req.body.id = uuidv4();
    }

    // Set href if not provided
    if (!req.body.href) {
      req.body.href = `/tmf-api/productCatalog/v5/exportJob/${req.body.id}`;
    }

    // Set default content type if not provided
    if (!req.body.contentType) {
      req.body.contentType = 'application/json';
    }

    const exportJob = new ExportJob(req.body);
    await exportJob.save();

    res.status(201).json(exportJob);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Export Job with this ID already exists' });
    }
    res.status(400).json({ error: 'Bad request', message: error.message });
  }
};

// PATCH /tmf-api/productCatalog/v5/exportJob/:id - Update export job
const updateExportJob = async (req, res) => {
  try {
    const exportJob = await ExportJob.findOneAndUpdate(
      { id: req.params.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!exportJob) {
      return res.status(404).json({ error: 'Export Job not found' });
    }

    res.json(exportJob);
  } catch (error) {
    res.status(400).json({ error: 'Bad request', message: error.message });
  }
};

// DELETE /tmf-api/productCatalog/v5/exportJob/:id - Delete export job
const deleteExportJob = async (req, res) => {
  try {
    const exportJob = await ExportJob.findOneAndDelete({ id: req.params.id });

    if (!exportJob) {
      return res.status(404).json({ error: 'Export Job not found' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

// POST /tmf-api/productCatalog/v5/exportJob/:id/start - Start export job execution
const startExportJob = async (req, res) => {
  try {
    const exportJob = await ExportJob.findOne({ id: req.params.id });

    if (!exportJob) {
      return res.status(404).json({ error: 'Export Job not found' });
    }

    if (exportJob.status !== 'notStarted') {
      return res.status(400).json({ error: 'Export Job cannot be started', message: `Current status: ${exportJob.status}` });
    }

    // Update status to running
    exportJob.status = 'running';
    await exportJob.save();

    // Here you would implement the actual export logic
    // For now, we'll simulate the process
    setTimeout(async () => {
      try {
        // Simulate export process completion
        exportJob.status = 'succeeded';
        exportJob.completionDate = new Date();
        await exportJob.save();
      } catch (error) {
        exportJob.status = 'failed';
        exportJob.errorLog = error.message;
        exportJob.completionDate = new Date();
        await exportJob.save();
      }
    }, 5000); // Simulate 5 second processing time

    res.json({
      message: 'Export job started successfully',
      job: exportJob
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = {
  listExportJobs,
  getExportJob,
  createExportJob,
  updateExportJob,
  deleteExportJob,
  startExportJob
};