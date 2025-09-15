const mongoose = require('mongoose');

const ProductSpecificationSchema = new mongoose.Schema({
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
  brand: {
    type: String,
    trim: true
  },
  lifecycleStatus: {
    type: String,
    enum: ['InStudy', 'InDesign', 'InTest', 'Active', 'Launched', 'Retired', 'Obsolete'],
    default: 'InStudy'
  },
  version: {
    type: String,
    default: '1.0'
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
  productNumber: {
    type: String,
    unique: true
  },
  isBundle: {
    type: Boolean,
    default: false
  },
  attachment: [{
    id: String,
    href: String,
    attachmentType: String,
    content: String,
    description: String,
    mimeType: String,
    name: String,
    url: String,
    size: {
      amount: Number,
      units: String
    },
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    },
    '@type': String,
    '@schemaLocation': String
  }],
  bundledProductSpecification: [{
    id: String,
    href: String,
    lifecycleStatus: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  productSpecCharacteristic: [{
    id: String,
    configurable: Boolean,
    description: String,
    extensible: Boolean,
    isUnique: Boolean,
    maxCardinality: Number,
    minCardinality: Number,
    name: String,
    regex: String,
    valueType: String,
    productSpecCharacteristicValue: [{
      isDefault: Boolean,
      rangeInterval: String,
      regex: String,
      unitOfMeasure: String,
      valueFrom: Number,
      valueTo: Number,
      valueType: String,
      validFor: {
        startDateTime: Date,
        endDateTime: Date
      },
      value: mongoose.Schema.Types.Mixed,
      '@type': String,
      '@schemaLocation': String
    }],
    '@type': String,
    '@schemaLocation': String
  }],
  productSpecificationRelationship: [{
    id: String,
    href: String,
    relationshipType: String,
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    },
    '@type': String,
    '@schemaLocation': String
  }],
  relatedParty: [{
    id: String,
    href: String,
    name: String,
    role: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  resourceSpecification: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  serviceSpecification: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  targetProductSchema: {
    '@schemaLocation': String,
    '@type': String
  },
  '@baseType': {
    type: String,
    default: 'ProductSpecification'
  },
  '@schemaLocation': {
    type: String
  },
  '@type': {
    type: String,
    default: 'ProductSpecification'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
ProductSpecificationSchema.index({ id: 1 });
ProductSpecificationSchema.index({ name: 1 });
ProductSpecificationSchema.index({ lifecycleStatus: 1 });
ProductSpecificationSchema.index({ productNumber: 1 });

module.exports = mongoose.model('ProductSpecification', ProductSpecificationSchema);
