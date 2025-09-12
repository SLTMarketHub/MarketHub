const mongoose = require('mongoose');

const ImportJobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  path: { type: String, required: true },   // file path or resource path
  status: { type: String, enum: ['InProgress', 'Completed', 'Failed'], default: 'InProgress' },
  url: { type: String },  // source URL if applicable
  creationDate: { type: String },
  completionDate: { type: String },
  errorLog: { type: String },
  '@type': { type: String, default: 'ImportJob' },
}, { timestamps: true });

module.exports = mongoose.model('ImportJob', ImportJobSchema);
