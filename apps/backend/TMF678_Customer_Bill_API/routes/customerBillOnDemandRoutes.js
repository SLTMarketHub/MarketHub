const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerBillOnDemandController');

//GET details of all CustomerBillOnDemand fields
router.get('/', controller.getAllBillsOnDemandFields);

// GET all CustomerBillOnDemand
router.get('/', controller.getAllBillsOnDemand);

// GET a specific CustomerBillOnDemand by ID
router.get('/:id', controller.getBillOnDemandById);

// POST create new CustomerBillOnDemand
router.post('/', controller.createBillOnDemand);

// PATCH partial update
router.patch('/:id', controller.updateBillOnDemand);

// DELETE soft-delete
router.delete('/:id', controller.deleteBillOnDemand);

module.exports = router;
