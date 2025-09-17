// partnershipSpecification.js
// Express routes for TMF668 PartnershipSpecification resource

const express = require('express');
const router = express.Router();
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

module.exports = router;
