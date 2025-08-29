const PartnershipSpecification = require('../models/PartnershipSpecification');
const uuid = require('../utils/uuid');
const { buildFilterAndPagination } = require('../utils/filter');
const { notify } = require('../services/notificationService');
const { serializeResource } = require('../utils/serialize');

// GET /partnershipSpecification
async function list(req, res) {
  const { filter, pagination } = buildFilterAndPagination(req.query);
  try {
    let specs = await PartnershipSpecification.find(filter, null, pagination);
    const fields = req.query.fields;
    let result = specs.map(doc => serializeResource(doc, 'PartnershipSpecification', req, fields));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /partnershipSpecification/:id
async function getById(req, res) {
  try {
    let spec = await PartnershipSpecification.findOne({ id: req.params.id });
    if (!spec) return res.status(404).json({ error: 'Not found' });
    const fields = req.query.fields;
    let result = serializeResource(spec, 'PartnershipSpecification', req, fields);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// POST /partnershipSpecification
async function create(req, res) {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'Missing required field: name' });
    const spec = new PartnershipSpecification({ ...req.body, id: uuid() });
    await spec.save();
    const fields = req.query.fields;
    let result = serializeResource(spec, 'PartnershipSpecification', req, fields);
    notify('CREATE', 'PartnershipSpecification', result);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PATCH /partnershipSpecification/:id
async function patch(req, res) {
  try {
    const spec = await PartnershipSpecification.findOne({ id: req.params.id });
    if (!spec) return res.status(404).json({ error: 'Not found' });
    Object.assign(spec, req.body);
    await spec.save();
    const fields = req.query.fields;
    let result = serializeResource(spec, 'PartnershipSpecification', req, fields);
    notify('UPDATE', 'PartnershipSpecification', result);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /partnershipSpecification/:id
async function remove(req, res) {
  try {
    const spec = await PartnershipSpecification.findOneAndDelete({ id: req.params.id });
    if (!spec) return res.status(404).json({ error: 'Not found' });
    notify('DELETE', 'PartnershipSpecification', spec);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { list, getById, create, patch, remove }; 