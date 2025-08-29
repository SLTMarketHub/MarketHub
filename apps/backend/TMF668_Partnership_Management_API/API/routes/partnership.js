const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/partnershipController');

router.get('/', ctrl.list);
router.get('/:id', ctrl.getById);
router.post('/', ctrl.create);
router.patch('/:id', ctrl.patch);
router.delete('/:id', ctrl.remove);

module.exports = router; 