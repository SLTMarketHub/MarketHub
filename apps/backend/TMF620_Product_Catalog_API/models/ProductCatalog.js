const mongoose = require('mongoose');

const ProductCatalogSchema = new mongoose.Schema({
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
  category: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  '@baseType': {
    type: String,
    default: 'Catalog'
  },
  '@schemaLocation': {
    type: String
  },
  '@type': {
    type: String,
    default: 'ProductCatalog'
  }
}, {
  timestamps: true,
  versionKey: false
});

ProductCatalogSchema.index({ id: 1 });
ProductCatalogSchema.index({ name: 1 });
ProductCatalogSchema.index({ lifecycleStatus: 1 });

module.exports = mongoose.model('ProductCatalog', ProductCatalogSchema);


