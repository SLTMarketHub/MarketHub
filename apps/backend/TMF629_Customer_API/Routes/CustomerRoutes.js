const express = require('express');
const router = express.Router();
const customerController = require('../Controllers/CustomerController');

router.post('/', customerController.createCustomer);
router.get('/:id', customerController.getCustomerById);
router.get('/', customerController.listCustomers);
router.patch('/:id', customerController.updateCustomer);
router.delete('/:id', customerController.deleteCustomer);

router.get('/engagedParty/:engagedPartyId', customerController.getCustomerByEngagedPartyId);
router.patch('/engagedParty/:engagedPartyId', customerController.updateCustomerByEngagedPartyId);

module.exports = router;
