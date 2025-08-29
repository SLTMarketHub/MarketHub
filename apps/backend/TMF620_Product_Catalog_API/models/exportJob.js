const mongoose = require('mongoose');

const exportJobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  path: { type: String },
  contentType: { type: String },
  status: { type: String, enum: ['notStarted', 'running', 'succeeded', 'failed'], default: 'notStarted' },
  creationDate: { type: Date, default: Date.now },
  lastUpdate: { type: Date },
  errorLog: { type: String },
  completionDate: { type: Date },
  '@type': { type: String, default: 'ExportJob' }
});

module.exports = mongoose.model('ExportJob', exportJobSchema);
