const express = require('express');
const router = express.Router();
const billCycleController = require('../controllers/billCycleController');

router.get('/', billCycleController.getAllBillCycles);
router.get('/', billCycleController.getSelectedBillCycleFields);
router.get('/:id', billCycleController.getBillCycleById);
router.post('/', billCycleController.createBillCycle);
router.patch('/:id', billCycleController.updateBillCycle);
router.delete('/:id', billCycleController.deleteBillCycle);


module.exports = router;