import express from 'express';
import {
  createHub,
  getHubs,
  getHub,
  deleteHub
} from '../controllers/hubController.js';

const router = express.Router();

// Base path: /tmf-api/productOrdering/v1/hub

// Create a new hub
router.post('/', createHub);

// Get all active hubs
router.get('/', getHubs);

// Get a single hub by ID
router.get('/:id', getHub);

// Delete a hub
router.delete('/:id', deleteHub);

export default router;
