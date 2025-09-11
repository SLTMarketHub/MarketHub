// partnership.js
// Express routes for TMF668 Partnership resource

const express = require('express');
const router = express.Router();
const Partnership = require('../models/Partnership');

/**
 * @swagger
 * /partnership:
 *   post:
 *     summary: Create a new Partnership
 *     tags: [Partnership]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partnership'
 *     responses:
 *       201:
 *         description: Partnership created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partnership'
 *       400:
 *         description: Validation error
 */

// CREATE: Add a new Partnership
// POST /partnership
router.post('/', async (req, res) => {
  try {
    // Create a new Partnership from request body
    const partnership = new Partnership(req.body);
    const savedPartnership = await partnership.save();
    res.status(201).json(savedPartnership);
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /partnership:
 *   get:
 *     summary: Get all Partnerships
 *     tags: [Partnership]
 *     responses:
 *       200:
 *         description: List of all Partnerships
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Partnership'
 */
router.get('/', async (req, res) => {
  try {
    const partnerships = await Partnership.find();
    res.json(partnerships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /partnership/{id}:
 *   get:
 *     summary: Get a Partnership by ID
 *     tags: [Partnership]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partnership ID
 *     responses:
 *       200:
 *         description: Partnership found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partnership'
 *       404:
 *         description: Partnership not found
 */
router.get('/:id', async (req, res) => {
  try {
    const partnership = await Partnership.findById(req.params.id);
    if (!partnership) return res.status(404).json({ error: 'Not found' });
    res.json(partnership);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /partnership/{id}:
 *   patch:
 *     summary: Update a Partnership by ID
 *     tags: [Partnership]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partnership ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Partnership'
 *     responses:
 *       200:
 *         description: Partnership updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Partnership'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Partnership not found
 */

// UPDATE: Patch a Partnership by ID
// PATCH /partnership/:id
router.patch('/:id', async (req, res) => {
  try {
    // Only update provided fields
    const updatedPartnership = await Partnership.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!updatedPartnership) return res.status(404).json({ error: 'Not found' });
    res.json(updatedPartnership);
  } catch (err) {
    // Handle Mongoose validation errors
    if (err.name === 'ValidationError') {
      const errors = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * @swagger
 * /partnership/{id}:
 *   delete:
 *     summary: Delete a Partnership by ID
 *     tags: [Partnership]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Partnership ID
 *     responses:
 *       200:
 *         description: Partnership deleted
 *       404:
 *         description: Partnership not found
 */
router.delete('/:id', async (req, res) => {
  try {
    const deletedPartnership = await Partnership.findByIdAndDelete(req.params.id);
    if (!deletedPartnership) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       properties:
 *         engagedParty:
 *           type: string
 *         role:
 *           type: string
 *         account:
 *           type: string
 *         agreement:
 *           type: string
 *         paymentMethod:
 *           type: string
 *         contactMedium:
 *           type: string
 *         creditProfile:
 *           type: string
 *     ValidFor:
 *       type: object
 *       properties:
 *         startDateTime:
 *           type: string
 *           format: date-time
 *         endDateTime:
 *           type: string
 *           format: date-time
 *     Partnership:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         specification:
 *           type: string
 *         partner:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Partner'
 *         status:
 *           type: string
 *         validFor:
 *           $ref: '#/components/schemas/ValidFor'
 *         href:
 *           type: string
 */
module.exports = router;
