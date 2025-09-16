const mongoose = require("mongoose");
const MoneySchema = require("../subSchemas/Money");
const TaxItemSchema = require("../subSchemas/TaxItem");
const CustomerBillRefSchema = require("../subSchemas/CustomerBillRef")
const TimePeriodSchema = require("../subSchemas/TimePeriod")
const BillingAccountRefSchema = require("../subSchemas/BillingAccountRef");
const ProductRefSchema = require("../subSchemas/ProductRef");
const CharacteristicSchema = require("../subSchemas/Characteristic");


const AppliedCustomerBillingRateSchema = new mongoose.Schema({
  id: String,
  href: String,
  appliedBillingRateType: String,
  date: Date,
  isBilled: Boolean,
  name: String,
  appliedTax: [TaxItemSchema],
  bill:CustomerBillRefSchema,
  billingAccount: BillingAccountRefSchema,
  characteristic: [CharacteristicSchema],
  periodCoverage: TimePeriodSchema,
  product: ProductRefSchema,
  taxExcludedAmount: MoneySchema,
  taxIncludedAmount: MoneySchema,
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String,

  // Recycle bin fields
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date, default: null }
});

module.exports = mongoose.model("AppliedCustomerBillingRate", AppliedCustomerBillingRateSchema, "AppliedCustomerBillingRate");
