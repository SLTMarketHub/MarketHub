const mongoose = require('mongoose');
const TimePeriodSchema = require('../subSchemas/TimePeriod');
const BillCycleSpecificationRefSchema = require('../subSchemas/BillCycleSpecificationRef');


const BillCycleSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: String,
  name: String,
  description: String,
  billingDate: Date,
  billingPeriod: String,
  chargeDate: Date,
  creditDate: Date,
  mailingDate: Date,
  paymentDueDate: Date,
  billCycleSpecification: BillCycleSpecificationRefSchema,
  validFor: TimePeriodSchema,
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String,

  // Recycle bin fields
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date, default: null }

});

module.exports = mongoose.model("BillCycle", BillCycleSchema,"BillCycle");
