const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// Create new notification
router.post('/', notificationController.createNotification);

// Get all notifications
router.get('/', notificationController.getAllNotifications);

// Get notification by ID
router.get('/:id', notificationController.getNotificationById);

module.exports = router;
