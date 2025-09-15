const mongoose = require('mongoose');

const ServiceCategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String },
  name: { type: String, required: true },
  description: { type: String },
  version: { type: String },
  lifecycleStatus: { type: String, enum: ['InDesign', 'Active', 'Deprecated', 'Retired'], default: 'InDesign' },
  lastUpdate: { type: String },

  parentId: { type: String }, // link to parent category
  isRoot: { type: Boolean, default: false },

  serviceCandidate: [{
    id: { type: String },
    href: { type: String },
    name: { type: String }
  }],

  relatedParty: [{
    id: { type: String },
    name: { type: String },
    role: { type: String }
  }],

  '@type': { type: String, default: 'ServiceCategory' }
}, { timestamps: true });

module.exports = mongoose.model('ServiceCategory', ServiceCategorySchema);
