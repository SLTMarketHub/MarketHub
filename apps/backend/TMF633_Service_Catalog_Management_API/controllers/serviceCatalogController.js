const { v4: uuidv4 } = require('uuid');
const ServiceCatalog = require('../models/serviceCatalog');

// List all service catalogs
exports.list = async (req, res) => {
  try {
    const catalogs = await ServiceCatalog.find();
    res.status(200).json(catalogs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Retrieve a specific service catalog
exports.getById = async (req, res) => {
  try {
    const catalog = await ServiceCatalog.findOne({ id: req.params.id });
    if (!catalog) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(200).json(catalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Create a new service catalog
exports.create = async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();

    const catalog = new ServiceCatalog({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      lastUpdate: now,
      '@type': req.body['@type'] || 'ServiceCatalog'
    });

    await catalog.save();
    res.status(201).json(catalog);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Patch (update partially) a service catalog
exports.patch = async (req, res) => {
  try {
    const { id, href, ...updates } = req.body; // prevent overwriting id/href
    const updated = await ServiceCatalog.findOneAndUpdate(
      { id: req.params.id },
      { ...updates, lastUpdate: new Date().toISOString() },
      { new: true }
    );
    if (!updated) return res.status(404).json({ code: 404, error: 'Not found' });

    updated.href = `${req.protocol}://${req.get('host')}${req.baseUrl}/${updated.id}`;
    await updated.save();
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Delete a service catalog
exports.remove = async (req, res) => {
  try {
    const deleted = await ServiceCatalog.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};
