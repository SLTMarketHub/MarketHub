const mongoose = require('mongoose');

const EventHubSchema = new mongoose.Schema({
  callback: { type: String, required: true },
  query: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TMF620_EventHub', EventHubSchema);


