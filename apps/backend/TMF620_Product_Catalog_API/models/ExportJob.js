const mongoose = require('mongoose');

const ExportJobSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  href: {
    type: String
  },
  completionDate: {
    type: Date,
    description: 'Date at which the job was completed'
  },
  contentType: {
    type: String,
    description: 'The format of the exported data (e.g., application/json, text/csv)'
  },
  creationDate: {
    type: Date,
    default: Date.now,
    description: 'Date at which the job was created'
  },
  errorLog: {
    type: String,
    description: 'Reason for failure if the job failed'
  },
  path: {
    type: String,
    description: 'URL of the root resource acting as the source for streaming content to the file'
  },
  query: {
    type: String,
    description: 'Used to scope the exported data'
  },
  status: {
    type: String,
    enum: ['notStarted', 'running', 'succeeded', 'failed'],
    default: 'notStarted',
    description: 'Status of the export job'
  },
  url: {
    type: String,
    required: true,
    description: 'URL of the file containing the data to be exported'
  },
  '@baseType': {
    type: String,
    default: 'Job'
  },
  '@schemaLocation': {
    type: String
  },
  '@type': {
    type: String,
    default: 'ExportJob'
  }
}, {
  timestamps: true,
  versionKey: false
});

ExportJobSchema.index({ id: 1 });
ExportJobSchema.index({ status: 1 });
ExportJobSchema.index({ creationDate: 1 });

module.exports = mongoose.model('ExportJob', ExportJobSchema);