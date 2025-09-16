const { v4: uuidv4 } = require('uuid');
const ServiceCategory = require('../models/ServiceCategory');

// List all service categories
exports.list = async (req, res) => {
  try {
    const categories = await ServiceCategory.find();
    res.status(200).json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Retrieve a specific service category
exports.getById = async (req, res) => {
  try {
    const category = await ServiceCategory.findOne({ id: req.params.id });
    if (!category) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(200).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Create a new service category
exports.create = async (req, res) => {
  try {
    const id = req.body.id || uuidv4();
    const now = new Date().toISOString();

    const category = new ServiceCategory({
      ...req.body,
      id,
      href: `${req.protocol}://${req.get('host')}${req.baseUrl}/${id}`,
      lastUpdate: now,
      '@type': req.body['@type'] || 'ServiceCategory'
    });

    await category.save();
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};

// Patch (update partially) a service category
exports.patch = async (req, res) => {
  try {
    const { id, href, ...updates } = req.body;
    const updated = await ServiceCategory.findOneAndUpdate(
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

// Delete a service category
exports.remove = async (req, res) => {
  try {
    const deleted = await ServiceCategory.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ code: 404, error: 'Not found' });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ code: 500, error: 'Internal server error' });
  }
};
