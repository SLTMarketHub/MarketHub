const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  correlationId: String,
  description: String,
  domain: String,
  eventId: {
    type: String,
    required: true,
    unique: true
  },
  eventTime: {
    type: Date,
    required: true
  },
  eventType: {
    type: String,
    required: true
  },
  priority: String,
  timeOccurred: Date,
  title: String,
  event: mongoose.Schema.Types.Mixed,  // Flexible payload (can be CustomerBill, CustomerBillOnDemand, etc.)
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

module.exports = mongoose.model('Notification', NotificationSchema);
