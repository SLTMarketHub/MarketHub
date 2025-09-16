const mongoose = require('mongoose');

const ImportJobSchema = new mongoose.Schema({
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
    description: 'The format of the imported data (e.g., application/json, text/csv)'
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
    description: 'URL of the root resource acting as the target for importing content from the file'
  },
  query: {
    type: String,
    description: 'Used to scope the imported data'
  },
  status: {
    type: String,
    enum: ['notStarted', 'running', 'succeeded', 'failed'],
    default: 'notStarted',
    description: 'Status of the import job'
  },
  url: {
    type: String,
    required: true,
    description: 'URL of the file containing the data to be imported'
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
    default: 'ImportJob'
  }
}, {
  timestamps: true,
  versionKey: false
});

ImportJobSchema.index({ id: 1 });
ImportJobSchema.index({ status: 1 });
ImportJobSchema.index({ creationDate: 1 });

module.exports = mongoose.model('ImportJob', ImportJobSchema);