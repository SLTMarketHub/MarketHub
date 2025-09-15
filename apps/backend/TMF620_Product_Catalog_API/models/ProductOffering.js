const mongoose = require('mongoose');

const ProductOfferingSchema = new mongoose.Schema({
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
    default: 'InStudy'
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
  isBundle: {
    type: Boolean,
    default: false
  },
  isSellable: {
    type: Boolean,
    default: true
  },
  statusReason: {
    type: String
  },
  agreement: [{
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
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
  bundledProductOffering: [{
    id: String,
    href: String,
    lifecycleStatus: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  category: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  channel: [{
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  marketSegment: [{
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  place: [{
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  prodSpecCharValueUse: [{
    id: String,
    description: String,
    maxCardinality: Number,
    minCardinality: Number,
    name: String,
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
    productSpecification: {
      id: String,
      href: String,
      name: String,
      version: String,
      '@type': String,
      '@schemaLocation': String,
      '@referredType': String
    },
    '@type': String,
    '@schemaLocation': String
  }],
  productOfferingPrice: [{
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  productOfferingRelationship: [{
    id: String,
    href: String,
    relationshipType: String,
    role: String,
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    },
    '@type': String,
    '@schemaLocation': String
  }],
  productOfferingTerm: [{
    description: String,
    name: String,
    duration: {
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
  productSpecification: {
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  },
  resourceCandidate: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  serviceCandidate: [{
    id: String,
    href: String,
    name: String,
    version: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  }],
  serviceLevelAgreement: {
    id: String,
    href: String,
    name: String,
    '@type': String,
    '@schemaLocation': String,
    '@referredType': String
  },
  '@baseType': {
    type: String,
    default: 'ProductOffering'
  },
  '@schemaLocation': {
    type: String
  },
  '@type': {
    type: String,
    default: 'ProductOffering'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
ProductOfferingSchema.index({ id: 1 });
ProductOfferingSchema.index({ name: 1 });
ProductOfferingSchema.index({ lifecycleStatus: 1 });
ProductOfferingSchema.index({ 'category.id': 1 });

module.exports = mongoose.model('ProductOffering', ProductOfferingSchema);
