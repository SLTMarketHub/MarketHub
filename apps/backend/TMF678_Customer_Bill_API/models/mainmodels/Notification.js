// models/mainmodels/Notification.js
const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  correlationId: String,
  description: String,
  domain: String,
  eventId: String,
  eventTime: { type: Date, default: Date.now },
  eventType: String,
  priority: String,
  timeOcurred: Date,
  title: String,
  event: mongoose.Schema.Types.Mixed, // flexible payload
  reportingSystem: {
    id: String,
    name: String,
    "@type": String,
    "@referredType": String
  },
  source: {
    id: String,
    name: String,
    "@type": String,
    "@referredType": String
  },
  "@baseType": String,
  "@type": String
});

module.exports = mongoose.model("Notification", NotificationSchema, "Notification");
