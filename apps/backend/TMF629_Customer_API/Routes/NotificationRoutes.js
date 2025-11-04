const express = require('express');
const router = express.Router();
const notificationController = require('../Controllers/NotificationController');

router.post('/', notificationController.saveEvent);
router.get('/', notificationController.getAllEvents);
router.get('/:eventId', notificationController.getEventById);

module.exports = router;
