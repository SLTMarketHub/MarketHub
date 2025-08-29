const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/hubController');

router.post('/', ctrl.register);
router.delete('/:id', ctrl.remove);

module.exports = router; 