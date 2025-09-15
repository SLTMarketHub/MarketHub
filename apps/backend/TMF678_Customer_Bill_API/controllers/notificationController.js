const Notification = require('../models/mainmodels/Notification');
const { v4: uuidv4 } = require('uuid');

exports.createNotification = async (req, res) => {
  try {
    const { eventData, eventType } = req.body;

    if (!eventData || !eventType) {
      return res.status(400).json({ error: "eventData and eventType are required" });
    }

    const now = new Date();

    let eventField = {};
    if (eventType.includes('CustomerBillOnDemand')) {
      eventField.customerBillOnDemand = eventData;
    } else if (eventType.includes('CustomerBill')) {
      eventField.customerBill = eventData;
    } else {
      eventField = eventData; // fallback
    }

    // create new notification
    const notification = new Notification({
      correlationId: uuidv4(),
      description: `${eventType} illustration`,
      domain: "Commercial",
      eventId: uuidv4(),
      eventTime: now,
      eventType,
      priority: "1",
      timeOccurred: now,
      title: eventType,
      event: eventField,
      reportingSystem: {
        id: "222",
        name: "APP-756",
        "@type": "ReportingResource",
        "@referredType": "LogicalResource"
      },
      source: {
        id: "233",
        name: "APP-628",
        "@type": "ReportingResource",
        "@referredType": "LogicalResource"
      },
      "@baseType": "Event",
      "@type": eventType
    });

    await notification.save();

    return res.status(201).json(notification);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create notification" });
  }
};

//fetch all notifications
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ eventTime: -1 });
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Failed to get notifications" });
  }
};

//fetch notifications by id
exports.getNotificationById = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) return res.status(404).json({ error: "Notification not found" });
    res.json(notification);
  } catch (error) {
    res.status(500).json({ error: "Failed to get notification" });
  }
};
