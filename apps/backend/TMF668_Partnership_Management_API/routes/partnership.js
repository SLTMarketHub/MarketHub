// partnership.js
const express = require('express');
const router = express.Router();
const partnershipController = require('../controllers/partnershipController');

router.post('/', partnershipController.createPartnership);
router.get('/', partnershipController.getAllPartnerships);
router.get('/:id', partnershipController.getPartnershipById);
router.patch('/:id', partnershipController.updatePartnership);
router.delete('/:id', partnershipController.deletePartnership);

module.exports = router;