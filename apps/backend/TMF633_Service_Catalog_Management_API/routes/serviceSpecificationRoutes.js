const express = require('express');
const router = express.Router();
const ServiceSpecification = require('../models/serviceSpecification');

// POST /ServiceSpecification
router.post('/', async (req, res) => {
  try {
    const spec = new ServiceSpecification(req.body);
    await spec.save();

    res.status(201).json({
      '@type': 'ServiceSpecification',
      href: `/tmf-api/serviceCatalogManagement/v4/serviceSpecification/${spec.uuid}`,
      id: spec.uuid,
      name: spec.name,
      description: spec.description,
      isBundle: spec.isBundle,
      lifecycleStatus: spec.lifecycleStatus,
      lastUpdate: spec.lastUpdate
    });
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET /ServiceSpecification/:id
router.get('/:id', async (req, res) => {
  try {
    const spec = await ServiceSpecification.findOne({ uuid: req.params.id });
    if (!spec) {
      return res.status(404).json({ code: 'NotFound', message: 'ServiceSpecification not found' });
    }
    res.status(200).json({
      '@type': 'ServiceSpecification',
      href: `/tmf-api/serviceCatalogManagement/v4/serviceSpecification/${spec.uuid}`,
      id: spec.uuid,
      name: spec.name,
      description: spec.description,
      isBundle: spec.isBundle,
      lifecycleStatus: spec.lifecycleStatus,
      lastUpdate: spec.lastUpdate
    });
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

// GET /ServiceSpecification (list or filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.id) filter.uuid = req.query.id;
    if (req.query.name) filter.name = req.query.name;
    if (req.query.lifecycleStatus) filter.lifecycleStatus = req.query.lifecycleStatus;
    if (req.query.isBundle) filter.isBundle = req.query.isBundle === 'true';

    const specs = await ServiceSpecification.find(filter);
    const response = specs.map(spec => ({
      '@type': 'ServiceSpecification',
      href: `/tmf-api/serviceCatalogManagement/v4/serviceSpecification/${spec.uuid}`,
      id: spec.uuid,
      name: spec.name,
      description: spec.description,
      isBundle: spec.isBundle,
      lifecycleStatus: spec.lifecycleStatus,
      lastUpdate: spec.lastUpdate
    }));
    res.status(200).json(response);
  } catch (err) {
    res.status(400).json({ code: 'BadRequest', message: err.message });
  }
});

module.exports = router;
