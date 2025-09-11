const express = require('express');
const router = express.Router(); 
const customerBillController = require('../controllers/customerBillController');


// GET all customer bills (with optional fields)
router.get('/', customerBillController.getAllBills);

// GET a customer bill by ID (with optional fields)
router.get('/:id', customerBillController.getBillById);

// POST create a new bill
router.post('/', customerBillController.createBill);

// PATCH partial update a bill by ID
router.patch('/:id', customerBillController.updateBillPartial);

// DELETE a bill by ID
router.delete('/:id', customerBillController.deleteBill);

module.exports = router;
