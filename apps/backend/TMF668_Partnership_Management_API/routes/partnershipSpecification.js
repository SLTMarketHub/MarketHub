// partnershipSpecification.js
// Express routes for TMF668 PartnershipSpecification resource

const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const partnershipSpecificationController = require('../controllers/partnershipSpecificationController');

/**
 * @swagger
 * tags:
 *   name: PartnershipSpecification
 *   description: Partnership Specification management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleSpecification:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           description: Name of the role
 *         description:
 *           type: string
 *           maxLength: 200
 *           description: Description of the role
 *         requiresBilling:
 *           type: boolean
 *           default: false
 *           description: Whether this role requires billing
 *         requiresSettlement:
 *           type: boolean
 *           default: false
 *           description: Whether this role requires settlement
 *     PartnershipSpecification:
 *       type: object
 *       required:
 *         - name
 *         - roleSpecification
 *       properties:
 *         _id:
 *           type: string
 *           description: PartnershipSpecification ID
 *         name:
 *           type: string
 *           description: Name of the partnership specification
 *         description:
 *           type: string
 *           maxLength: 500
 *           description: Description of the specification
 *         roleSpecification:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/RoleSpecification'
 *           description: List of role specifications
 *         agreementSpecification:
 *           type: array
 *           items:
 *             type: string
 *           description: References to agreement specifications
 *         href:
 *           type: string
 *           description: URL reference to this resource
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */


/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnershipSpecification:
 *   post:
 *     summary: Create a new PartnershipSpecification
 *     tags: [PartnershipSpecification]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartnershipSpecification'
 *     responses:
 *       '201':
 *         description: PartnershipSpecification created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipSpecification'
 *       '400':
 *         description: Validation error
 *       '500':
 *         description: Internal server error
 */
router.post('/', partnershipSpecificationController.createPartnershipSpecification);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnershipSpecification:
 *   get:
 *     summary: Get all PartnershipSpecifications
 *     tags: [PartnershipSpecification]
 *     responses:
 *       200:
 *         description: List of partnership specifications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PartnershipSpecification'
 *       500:
 *         description: Internal server error
 */
router.get('/', partnershipSpecificationController.getAllPartnershipSpecifications);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnershipSpecification/{id}:
 *   get:
 *     summary: Get a PartnershipSpecification by ID
 *     tags: [PartnershipSpecification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: PartnershipSpecification ID
 *     responses:
 *       200:
 *         description: PartnershipSpecification details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipSpecification'
 *       404:
 *         description: PartnershipSpecification not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', partnershipSpecificationController.getPartnershipSpecificationById);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnershipSpecification/{id}:
 *   patch:
 *     summary: Update a PartnershipSpecification by ID
 *     tags: [PartnershipSpecification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: PartnershipSpecification ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PartnershipSpecification'
 *     responses:
 *       200:
 *         description: PartnershipSpecification updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipSpecification'
 *       400:
 *         description: Validation error
 *       404:
 *         description: PartnershipSpecification not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', partnershipSpecificationController.updatePartnershipSpecification);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnershipSpecification/{id}:
 *   delete:
 *     summary: Delete a PartnershipSpecification by ID
 *     tags: [PartnershipSpecification]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: PartnershipSpecification ID
 *     responses:
 *       200:
 *         description: PartnershipSpecification deleted successfully
 *       404:
 *         description: PartnershipSpecification not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', partnershipSpecificationController.deletePartnershipSpecification);
=======
const PartnershipSpecification = require('../models/PartnershipSpecification');

// CREATE: Add a new PartnershipSpecification
// POST /partnershipSpecification
router.post('/', async (req, res) => {
  try {
    // Create a new PartnershipSpecification from request body
    const spec = new PartnershipSpecification(req.body);
    const savedSpec = await spec.save();
    res.status(201).json(savedSpec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// READ: Get all PartnershipSpecifications
// GET /partnershipSpecification
router.get('/', async (req, res) => {
  try {
    const specs = await PartnershipSpecification.find();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ: Get a PartnershipSpecification by ID
// GET /partnershipSpecification/:id
router.get('/:id', async (req, res) => {
  try {
    const spec = await PartnershipSpecification.findById(req.params.id);
    if (!spec) return res.status(404).json({ error: 'Not found' });
    res.json(spec);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE: Patch a PartnershipSpecification by ID
// PATCH /partnershipSpecification/:id
router.patch('/:id', async (req, res) => {
  try {
    // Only update provided fields
    const updatedSpec = await PartnershipSpecification.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    if (!updatedSpec) return res.status(404).json({ error: 'Not found' });
    res.json(updatedSpec);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE: Remove a PartnershipSpecification by ID
// DELETE /partnershipSpecification/:id
router.delete('/:id', async (req, res) => {
  try {
    const deletedSpec = await PartnershipSpecification.findByIdAndDelete(req.params.id);
    if (!deletedSpec) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
>>>>>>> 277971280b135ebd78622acedd156b1a075853a9

module.exports = router;
