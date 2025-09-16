import asyncHandler from 'express-async-handler';
import Hub from '../models/Hub.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create a new hub
// @route   POST /tmf-api/productOrdering/v1/hub
// @access  Public
export const createHub = asyncHandler(async (req, res) => {
  const { callback, query } = req.body;
  
  const hub = await Hub.create({
    id: uuidv4(),
    callback,
    query,
    state: 'active',
    baseType: 'Hub',
    schemaLocation: 'https://github.com/tmforum-rand/schemas/blob/Common/Hub.schema.json',
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days expiration
  });

  res.status(201).json(hub);
});

// @desc    Get all hubs
// @route   GET /tmf-api/productOrdering/v1/hub
// @access  Public
export const getHubs = asyncHandler(async (req, res) => {
  const hubs = await Hub.find({ expiresAt: { $gt: new Date() } });
  
  res.json({
    status: 'success',
    count: hubs.length,
    hub: hubs
  });
});

// @desc    Get single hub
// @route   GET /tmf-api/productOrdering/v1/hub/:id
// @access  Public
export const getHub = asyncHandler(async (req, res) => {
  const hub = await Hub.findOne({ 
    id: req.params.id,
    expiresAt: { $gt: new Date() }
  });

  if (!hub) {
    res.status(404);
    throw new Error('Hub not found or expired');
  }

  res.json(hub);
});

// @desc    Delete hub
// @route   DELETE /tmf-api/productOrdering/v1/hub/:id
// @access  Public
export const deleteHub = asyncHandler(async (req, res) => {
  const hub = await Hub.findOne({ id: req.params.id });

  if (!hub) {
    res.status(404);
    throw new Error('Hub not found');
  }

  await Hub.deleteOne({ id: req.params.id });
  
  res.json({ message: 'Hub removed' });
});
