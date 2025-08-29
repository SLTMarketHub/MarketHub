const mongoose = require('mongoose');

const importJobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  url: { type: String, required: true },
  contentType: { type: String },
  path: { type: String },
  status: { type: String, enum: ['notStarted', 'running', 'succeeded', 'failed'], default: 'notStarted' },
  creationDate: { type: Date, default: Date.now },
  lastUpdate: { type: Date },
  errorLog: { type: String },
  completionDate: { type: Date },
  '@type': { type: String, default: 'ImportJob' }
});

module.exports = mongoose.model('ImportJob', importJobSchema);
