const { v4: uuidv4 } = require('uuid');
const ServiceCandidate = require('../models/serviceCandidate');

// List all service candidates
exports.list = async (req, res) => {
  try {
    const candidates = await ServiceCandidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Retrieve a service candidate by ID
exports.getById = async (req, res) => {
  try {
    const candidate = await ServiceCandidate.findOne({ id: req.params.id });
    if (!candidate) {
      return res.status(404).json({ code: 404, error: 'Not found' });
    }
    res.status(200).json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Create a new service candidate
exports.create = async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();

    const candidate = new ServiceCandidate({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      lastUpdate: now,
      '@type': req.body['@type'] || 'ServiceCandidate'
    });

    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Patch (update partially) a service candidate
exports.update = async (req, res) => {
  try {
    const { id, href, ...updates } = req.body; // avoid overwriting id/href
    const updated = await ServiceCandidate.findOneAndUpdate(
      { id: req.params.id },
      { ...updates, lastUpdate: new Date().toISOString() },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ code: 404, error: 'Not found' });
    }

    updated.href = `${req.protocol}://${req.get('host')}${req.baseUrl}/${updated.id}`;
    await updated.save();

    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Delete a service candidate
exports.remove = async (req, res) => {
  try {
    const deleted = await ServiceCandidate.findOneAndDelete({ id: req.params.id });
    if (!deleted) {
      return res.status(404).json({ code: 404, error: 'Not found' });
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};
