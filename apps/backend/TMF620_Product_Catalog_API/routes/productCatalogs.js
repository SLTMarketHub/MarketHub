const express = require('express');
const router = express.Router();
const { body, validationResult, query } = require('express-validator');
const ProductCatalog = require('../models/ProductCatalog');
const { publishEvent } = require('../services/eventPublisher');

const validateCatalog = [
  body('id').notEmpty().withMessage('Catalog ID is required'),
  body('name').notEmpty().withMessage('Catalog name is required'),
  body('lifecycleStatus').optional().isIn(['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'])
];

router.get('/', [
  query('offset').optional().isInt({ min: 0 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { offset = 0, limit = 20, name } = req.query;
  const filter = {};
  if (name) filter.name = new RegExp(name, 'i');
  const data = await ProductCatalog.find(filter)
    .skip(parseInt(offset)).limit(parseInt(limit)).sort({ createdAt: -1 });
  const total = await ProductCatalog.countDocuments(filter);
  res.json({ data, pagination: { offset: parseInt(offset), limit: parseInt(limit), total, hasMore: (parseInt(offset) + parseInt(limit)) < total } });
});

router.get('/:id', async (req, res) => {
  const item = await ProductCatalog.findOne({ id: req.params.id });
  if (!item) return res.status(404).json({ error: 'Catalog not found' });
  res.json(item);
});

router.post('/', validateCatalog, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  if (!req.body.href) req.body.href = `/api/v1/productCatalogs/${req.body.id}`;
  const item = new ProductCatalog(req.body);
  await item.save();
  res.status(201).json(item);
  publishEvent('ProductCatalogCreateEvent', 'ProductCatalog', item.toObject());
});

router.patch('/:id', async (req, res) => {
  const item = await ProductCatalog.findOneAndUpdate({ id: req.params.id }, { $set: req.body }, { new: true, runValidators: true });
  if (!item) return res.status(404).json({ error: 'Catalog not found' });
  res.json(item);
  publishEvent('ProductCatalogAttributeValueChangeEvent', 'ProductCatalog', item.toObject());
});

router.delete('/:id', async (req, res) => {
  const item = await ProductCatalog.findOneAndDelete({ id: req.params.id });
  if (!item) return res.status(404).json({ error: 'Catalog not found' });
  res.status(204).send();
  publishEvent('ProductCatalogDeleteEvent', 'ProductCatalog', item.toObject());
});

module.exports = router;


