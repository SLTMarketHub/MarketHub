const mongoose = require('mongoose');

const ValidForSchema = new mongoose.Schema({
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true }
}, { _id: false });

const DurationSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  units: { type: String, required: true }
}, { _id: false });

const ProductOfferingTermSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: { type: DurationSchema, required: true },
  validFor: { type: ValidForSchema },
  '@type': { type: String, default: 'ProductOfferingTerm', required: true }
}, { _id: false });

const PlaceSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  name: String,
  '@referredType': { type: String, required: true },
  '@type': { type: String, default: 'PlaceRef', required: true }
}, { _id: false });

const PolicySchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  name: String,
  '@referredType': { type: String, required: true },
  '@type': { type: String, default: 'PolicyRef', required: true }
}, { _id: false });

const PricingLogicAlgorithmSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  name: String,
  description: String,
  plaSpecId: String,
  validFor: ValidForSchema,
  '@type': { type: String, default: 'PricingLogicAlgorithm', required: true }
}, { _id: false });

const TaxItemSchema = new mongoose.Schema({
  taxAmount: {
    unit: { type: String, required: true },
    value: { type: Number, required: true }
  },
  taxCategory: String,
  taxRate: Number,
  '@type': { type: String, default: 'TaxItem', required: true }
}, { _id: false });

const PopRelationshipSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  relationshipType: String,
  validFor: ValidForSchema,
  role: String,
  '@referredType': { type: String, required: true },
  '@type': { type: String, default: 'ProductOfferingPriceRelationship', required: true }
}, { _id: false });

const BundledPopRelationshipSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  '@referredType': { type: String, required: true },
  '@type': { type: String, default: 'ProductOfferingPriceRelationship', required: true }
}, { _id: false });

const ProdSpecCharValueUseSchema = new mongoose.Schema({
  '@type': { type: String, default: 'ProdSpecCharValueUse', required: true },
  name: { type: String, required: true },
  valueType: { type: String, required: true },
  productSpecCharacteristicValue: [{
  '@type': { type: String, required: true },
  valueType: { type: String, required: true }
}],

  productSpecification: {
    '@referredType': { type: String, required: true },
    '@type': { type: String, required: true },
    href: { type: String, required: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    targetProductSchema: {
      '@type': { type: String, required: true }
    }
  }
}, { _id: false });

const ProductOfferingPriceSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: { type: String, required: true },
  name: { type: String, required: true },
  description: String,
  version: String,
  validFor: ValidForSchema,
  priceType: String,
  recurringChargePeriodType: String,
  recurringChargePeriodLength: Number,
  lastUpdate: { type: Date, default: Date.now, required: true },
  isBundle: Boolean,
  lifecycleStatus: { type: String, default: 'Active', required: true },
  unitOfMeasure: {
    amount: { type: Number, required: true },
    units: { type: String, required: true }
  },
  price: {
    unit: { type: String, required: true },
    value: { type: Number, required: true }
  },
  percentage: Number,
  productOfferingTerm: { type: [ProductOfferingTermSchema], required: true },
  place: { type: [PlaceSchema], required: true },
  policy: { type: [PolicySchema], required: true },
  pricingLogicAlgorithm: { type: [PricingLogicAlgorithmSchema], required: true },
  tax: { type: [TaxItemSchema], required: true },
  popRelationship: { type: [PopRelationshipSchema], required: true },
  bundledPopRelationship: { type: [BundledPopRelationshipSchema], required: true },
  prodSpecCharValueUse: { type: [ProdSpecCharValueUseSchema], required: true },
  '@type': { type: String, default: 'ProductOfferingPrice', required: true }
}, { timestamps: true });

module.exports = mongoose.model('ProductOfferingPrice', ProductOfferingPriceSchema);