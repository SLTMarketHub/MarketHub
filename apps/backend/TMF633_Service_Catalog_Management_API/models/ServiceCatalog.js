const mongoose = require('mongoose');

const ServiceCatalogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  version: { type: String },
  lifecycleStatus: { type: String, enum: ['InDesign', 'Active', 'Deprecated', 'Retired'], default: 'InDesign' },
  lastUpdate: { type: String },
  validFor: {
    startDateTime: { type: String },
    endDateTime: { type: String },
  },
  relatedParty: [{
    id: { type: String },
    name: { type: String },
    role: { type: String }
  }],
  '@type': { type: String, default: 'ServiceCatalog' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceCatalog', ServiceCatalogSchema);
