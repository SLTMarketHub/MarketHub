const mongoose = require('mongoose');

const EventHubSchema = new mongoose.Schema({
    eventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    eventTime: { type: Date, required: true },
    event: { type: Object, required: true }
}, { timestamps: true });

module.exports = mongoose.model('EventHub', EventHubSchema);

