// partnershipSpecification.js
// Express routes for TMF668 PartnershipSpecification resource

const express = require('express');
const router = express.Router();
const partnershipSpecificationController = require('../controllers/partnershipSpecificationController');

router.post('/', partnershipSpecificationController.createPartnershipSpecification);
router.get('/', partnershipSpecificationController.getAllPartnershipSpecifications);
router.get('/:id', partnershipSpecificationController.getPartnershipSpecificationById);
router.patch('/:id', partnershipSpecificationController.updatePartnershipSpecification);
router.delete('/:id', partnershipSpecificationController.deletePartnershipSpecification);

module.exports = router;