const { registerHub, removeHub } = require('../API/services/notificationService');
const uuid = require('../API/utils/uuid');
const { validationResult } = require('express-validator');
const logger = require('../API/utils/logger');

/**
 * @swagger
 * /tmf-api/partnershipManagement/hub:
 *   post:
 *     tags: [Hub]
 *     summary: Register a new notification hub
 *     description: Register a callback URI to receive notifications
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Hub'
 *     responses:
 *       201:
 *         description: Hub registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The hub registration ID
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
async function register(req, res) {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.warn('Hub registration validation failed', { errors: errors.array() });
      return res.status(400).json({ 
        code: 400,
        message: 'Validation error',
        details: errors.array()
      });
    }

    const { callback, query, ...rest } = req.body;
    
    // Validate required fields
    if (!callback) {
      return res.status(400).json({
        code: 400,
        message: 'Validation error',
        details: [{ msg: 'callback is required', param: 'callback' }]
      });
    }

    const id = uuid();
    const listener = { 
      id, 
      callback,
      query: query || {},
      ...rest,
      createdAt: new Date().toISOString()
    };
    
    registerHub(listener);
    logger.info('New hub registered', { hubId: id, callback });
    
    res.status(201).json({ 
      id,
      href: `/tmf-api/partnershipManagement/hub/${id}`
    });
  } catch (error) {
    logger.error('Error registering hub', { error: error.message, stack: error.stack });
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
      reference: req.id
    });
  }
}

/**
 * @swagger
 * /tmf-api/partnershipManagement/hub/{id}:
 *   delete:
 *     tags: [Hub]
 *     summary: Unregister a notification hub
 *     description: Remove a previously registered hub
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The hub registration ID
 *     responses:
 *       204:
 *         description: Hub unregistered successfully
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/ServerError'
 */
async function remove(req, res) {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        code: 400,
        message: 'Hub ID is required'
      });
    }
    
    const hub = removeHub(id);
    
    if (!hub) {
      logger.warn('Hub not found for removal', { hubId: id });
      return res.status(404).json({
        code: 404,
        message: 'Hub not found'
      });
    }
    
    logger.info('Hub unregistered', { hubId: id });
    res.status(204).send();
  } catch (error) {
    logger.error('Error removing hub', { 
      error: error.message, 
      stack: error.stack,
      hubId: req.params.id 
    });
    
    res.status(500).json({
      code: 500,
      message: 'Internal server error',
      reference: req.id
    });
  }
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Hub:
 *       type: object
 *       required:
 *         - callback
 *       properties:
 *         callback:
 *           type: string
 *           format: uri
 *           description: The callback URI to receive notifications
 *         query:
 *           type: object
 *           description: Additional query parameters to include in callbacks
 *         secret:
 *           type: string
 *           description: Optional secret for verifying callbacks
 */

module.exports = { 
  register, 
  remove,
  // Export for testing
  _test: {
    registerHub,
    removeHub
  }
}; 