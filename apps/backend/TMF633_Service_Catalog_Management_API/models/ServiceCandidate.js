const mongoose = require('mongoose');

const ServiceCandidateSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  version: { type: String },
  lifecycleStatus: { type: String, enum: ['InDesign', 'Active', 'Deprecated', 'Retired'], default: 'InDesign' },
  lastUpdate: { type: String },

  category: [{
    id: { type: String },
    href: { type: String },
    name: { type: String }
  }],

  serviceSpecification: {
    id: { type: String },
    href: { type: String },
    name: { type: String }
  },

  relatedParty: [{
    id: { type: String },
    name: { type: String },
    role: { type: String }
  }],

  '@type': { type: String, default: 'ServiceCandidate' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceCandidate', ServiceCandidateSchema);
