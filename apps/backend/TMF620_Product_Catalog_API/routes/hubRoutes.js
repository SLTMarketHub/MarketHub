const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const EventHub = require('../models/EventHub');

router.post('/', [
  body('callback').isURL().withMessage('callback must be a valid URL'),
  body('query').optional().isString()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const hub = new EventHub(req.body);
  await hub.save();
  res.status(201).json(hub);
});

router.get('/', async (_req, res) => {
  const hubs = await EventHub.find();
  res.json(hubs);
});

router.delete('/:id', async (req, res) => {
  const deleted = await EventHub.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Hub not found' });
  res.status(204).send();
});

module.exports = router;


