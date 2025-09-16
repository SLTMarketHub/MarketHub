const mongoose = require('mongoose');

const exportJobSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  errorDetails: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ExportJob', exportJobSchema);
