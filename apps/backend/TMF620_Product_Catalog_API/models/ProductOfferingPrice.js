const mongoose = require('mongoose');

// TMF620 ProductOfferingPrice schema
const ProductOfferingPriceSchema = new mongoose.Schema({
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
  // TMF620 core fields for ProductOfferingPrice
  priceType: {
    type: String,
    enum: ['oneTime', 'recurring', 'usage'],
    required: true
  },
  recurringChargePeriod: {
    type: String // e.g. 'hour', 'day', 'month', 'year'
  },
  recurringChargePeriodLength: {
    type: Number // e.g. 1 for monthly, 12 for yearly (months)
  },
  unitOfMeasure: {
    amount: Number,
    units: String // e.g. 'GB', 'minute', 'message'
  },
  price: {
    taxIncludedAmount: {
      value: { type: Number },
      unit: { type: String } // currency code like 'USD'
    },
    dutyFreeAmount: {
      value: { type: Number },
      unit: { type: String }
    },
    taxRate: { type: Number }
  },
  validForPrice: {
    startDateTime: Date,
    endDateTime: Date
  },
  priceAlteration: [{
    applicationOrder: Number,
    description: String,
    name: String,
    priceType: { type: String, enum: ['oneTime', 'recurring', 'usage'] },
    recurringChargePeriod: String,
    unitOfMeasure: {
      amount: Number,
      units: String
    },
    price: {
      taxIncludedAmount: {
        value: { type: Number },
        unit: { type: String }
      },
      dutyFreeAmount: {
        value: { type: Number },
        unit: { type: String }
      },
      taxRate: { type: Number }
    },
    validFor: {
      startDateTime: Date,
      endDateTime: Date
    },
    '@type': String,
    '@schemaLocation': String
  }],
  '@baseType': {
    type: String,
    default: 'ProductOfferingPrice'
  },
  '@schemaLocation': {
    type: String
  },
  '@type': {
    type: String,
    default: 'ProductOfferingPrice'
  }
}, {
  timestamps: true,
  versionKey: false
});

// Indexes for better performance
ProductOfferingPriceSchema.index({ id: 1 });
ProductOfferingPriceSchema.index({ name: 1 });
ProductOfferingPriceSchema.index({ lifecycleStatus: 1 });

module.exports = mongoose.model('ProductOfferingPrice', ProductOfferingPriceSchema);
