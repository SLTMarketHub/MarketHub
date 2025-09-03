const mongoose = require('mongoose');

const EventHubSchema = new mongoose.Schema({
    callback: { type: String, required: true }
});

module.exports = mongoose.model('EventHub', EventHubSchema);
