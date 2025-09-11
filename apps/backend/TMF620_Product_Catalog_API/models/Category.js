const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true
  },
  href: {
    type: String
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  version: {
    type: String,
    default: '1.0'
  },
  lifecycleStatus: {
    type: String,
    enum: ['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'],
    default: 'Active'
  },
  validFor: {
    startDateTime: {
      type: Date,
      default: Date.now
    },
    endDateTime: {
      type: Date
    }
  },
  isRoot: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: String,
    ref: 'Category'
  },
  category: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  productOffering: [{
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  '@baseType': {
    type: String,
    default: 'Category'
  },
  '@schemaLocation': {
    type: String
  },
  '@type': {
    type: String,
    default: 'Category'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
CategorySchema.index({ id: 1 });
CategorySchema.index({ name: 1 });
CategorySchema.index({ parentId: 1 });
CategorySchema.index({ lifecycleStatus: 1 });

module.exports = mongoose.model('Category', CategorySchema);
