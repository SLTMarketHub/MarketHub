const ProductCatalog = require('../models/ProductCatalog');

exports.createCatalog = async (req, res) => {
  try {
    const catalog = new ProductCatalog(req.body);
    await catalog.save();
    res.status(201).json(catalog);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getCatalogs = async (req, res) => {
  const catalogs = await ProductCatalog.find();
  res.json(catalogs);
};

exports.getCatalogById = async (req, res) => {
  const catalog = await ProductCatalog.findOne({ id: req.params.id });
  if (!catalog) return res.status(404).send('Not found');
  res.json(catalog);
};

exports.updateCatalog = async (req, res) => {
  try {
    const updated = await ProductCatalog.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteCatalog = async (req, res) => {
  await ProductCatalog.deleteOne({ id: req.params.id });
  res.status(204).send();
};