const mongoose = require('mongoose');

const ProductSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: String,
  productNumber: String,
  description: String,
  isBundle: Boolean,
  lastUpdate: { type: Date, required: true, default: new Date('2020-09-23T16:42:23.000Z') },
  lifecycleStatus: { type: String, default: 'Active' },
  validFor: {
    startDateTime: Date,
    endDateTime: Date
  },
  version: String,
  relatedParty: Array,
  attachment: Array,
  bundledProductSpecification: Array,
  targetProductSchema: Object,
  productSpecificationRelationship: Array,
  serviceSpecification: Array,
  resourceSpecification: Array,
  productSpecCharacteristic: Array,
  intentSpecification: Object,
  '@type': { type: String, required: true, default: 'ProductSpecification' }
}, { timestamps: true });

module.exports = mongoose.model('ProductSpecification', ProductSpecificationSchema);
