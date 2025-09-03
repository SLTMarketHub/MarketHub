const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/NotificationController');

router.post('/', notificationController.registerListener);
router.delete('/:id', notificationController.unregisterListener);

module.exports = router;
