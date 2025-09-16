const Notification = require("../models/mainmodels/Notification");
const { v4: uuidv4 } = require("uuid");

async function createNotification(eventType, resource, resourceName, description = "") {
  const notification = new Notification({
    correlationId: uuidv4(),
    description: description || `${eventType} notification`,
    domain: "Commercial",
    eventId: uuidv4(),
    eventTime: new Date(),
    eventType,
    priority: "1",
    timeOcurred: new Date(),
    title: eventType,
    event: {
      [resourceName]: resource
    },
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

  return await notification.save();
}

module.exports = { createNotification };
