const express = require('express');
const router = express.Router();
const controller = require('../controllers/productOfferingController');

router.post('/productOffering', controller.createOffering);
router.get('/productOffering', controller.getOfferings);
router.get('/productOffering/:id', controller.getOfferingById);
router.patch('/productOffering/:id', controller.updateOffering);
router.delete('/productOffering/:id', controller.deleteOffering);

module.exports = router;
