const Partnership = require('../models/Partnership');
const uuid = require('../utils/uuid');
const { buildFilterAndPagination } = require('../utils/filter');
const { notify } = require('../services/notificationService');
const { serializeResource } = require('../utils/serialize');

// GET /partnership
async function list(req, res) {
  const { filter, pagination } = buildFilterAndPagination(req.query);
  try {
    // Support filtering by href
    if (req.query.href) {
      // Extract the id from the href
      const href = req.query.href;
      // Partnership href always ends with /partnership/<id>
      const match = href.match(/\/partnershipManagement\/v4\/partnership\/([a-fA-F0-9\-]+)/);
      console.log('Filtering by href:', href, 'Extracted ID:', match ? match[1] : null);
      if (match && match[1]) {
        filter.id = match[1];
      } else {
        // If href is invalid, return empty array
        return res.status(200).json([]);
      }
    }
    let partnerships = await Partnership.find(filter, null, pagination);
    const fields = req.query.fields;
    let result = partnerships.map(doc => serializeResource(doc, 'Partnership', req, fields));
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// GET /partnership/:id
async function getById(req, res) {
  try {
    let partnership = await Partnership.findOne({ id: req.params.id });
    if (!partnership) return res.status(404).json({ error: 'Not found' });
    const fields = req.query.fields;
    let result = serializeResource(partnership, 'Partnership', req, fields);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// POST /partnership
async function create(req, res) {
  try {
    if (!req.body.name) return res.status(400).json({ error: 'Missing required field: name' });
    if (!req.body.specification || !req.body.specification.id || !req.body.specification.href || !req.body.specification.name) {
      return res.status(400).json({ error: 'Missing required field: specification (id, href, name)'});
    }
    const partnership = new Partnership({ ...req.body, id: uuid() });
    await partnership.save();
    const fields = req.query.fields;
    let result = serializeResource(partnership, 'Partnership', req, fields);
    notify('CREATE', 'Partnership', result);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// PATCH /partnership/:id
async function patch(req, res) {
  try {
    const partnership = await Partnership.findOne({ id: req.params.id });
    if (!partnership) return res.status(404).json({ error: 'Not found' });
    Object.assign(partnership, req.body);
    await partnership.save();
    const fields = req.query.fields;
    let result = serializeResource(partnership, 'Partnership', req, fields);
    notify('UPDATE', 'Partnership', result);
    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

// DELETE /partnership/:id
async function remove(req, res) {
  try {
    const partnership = await Partnership.findOneAndDelete({ id: req.params.id });
    if (!partnership) return res.status(404).json({ error: 'Not found' });
    notify('DELETE', 'Partnership', partnership);
    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = { list, getById, create, patch, remove }; 