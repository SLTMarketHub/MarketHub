const mongoose = require('mongoose');

const ServiceSpecificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  version: { type: String },
  href: { type: String },
  lastUpdate: { type: String },
  '@type': { type: String, default: 'ServiceSpecification' },
}, { timestamps: true });

module.exports = mongoose.model('ServiceSpecification', ServiceSpecificationSchema);
