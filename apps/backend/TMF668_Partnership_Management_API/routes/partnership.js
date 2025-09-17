// partnership.js
const express = require('express');
const router = express.Router();
const partnershipController = require('../controllers/partnershipController');

/**
 * @swagger
 * tags:
 *   name: Partnership
 *   description: Partnership management endpoints
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Partner:
 *       type: object
 *       required:
 *         - engagedParty
 *         - role
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
 *       required:
 *         - startDateTime
 *       properties:
 *         startDateTime:
 *           type: string
 *           format: date-time
 *         endDateTime:
 *           type: string
 *           format: date-time
 *     Partnership:
 *       type: object
 *       required:
 *         - name
 *         - specification
 *         - partner
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
 *           enum: [active, terminated, pending]
 *           default: pending
 *         validFor:
 *           $ref: '#/components/schemas/ValidFor'
 *         href:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnership:
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
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', partnershipController.createPartnership);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnership:
 *   get:
 *     summary: Get all Partnerships
 *     tags: [Partnership]
 *     responses:
 *       200:
 *         description: List of partnerships
 *       500:
 *         description: Internal server error
 */
router.get('/', partnershipController.getAllPartnerships);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnership/{id}:
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
 *         description: Partnership details
 *       404:
 *         description: Partnership not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', partnershipController.getPartnershipById);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnership/{id}:
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
 *         description: Partnership updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Partnership not found
 *       500:
 *         description: Internal server error
 */
router.patch('/:id', partnershipController.updatePartnership);

/**
 * @swagger
 * /tmf-api/partnershipManagement/v4/partnership/{id}:
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
 *         description: Partnership deleted successfully
 *       404:
 *         description: Partnership not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', partnershipController.deletePartnership);

module.exports = router;