const mongoose = require('mongoose');

const ExportJobSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  query: { type: String, required: true }, // query criteria for export
  path: { type: String }, // file path or target location
  status: { type: String, enum: ['InProgress', 'Completed', 'Failed'], default: 'InProgress' },
  url: { type: String }, // destination URL if applicable
  creationDate: { type: String },
  completionDate: { type: String },
  errorLog: { type: String },
  '@type': { type: String, default: 'ExportJob' },
}, { timestamps: true });

module.exports = mongoose.model('ExportJob', ExportJobSchema);
