const mongoose = require("mongoose");
const MoneySchema = require("../subSchemas/Money");
const RefSchema = require("../subSchemas/Ref");
const TimePeriodSchema = require("../subSchemas/TimePeriod");
const AppliedPaymentSchema = require("../subSchemas/AppliedPayment");
const AttachmentSchema = require("../subSchemas/Attachment");
const TaxItemSchema = require("../subSchemas/TaxItem");
const RelatedPartySchema = require("../subSchemas/RelatedPartyRefOrRoleRef");
const BillingAccountRefSchema = require("../subSchemas/BillingAccountRef");
const FinancialAccountRefSchema = require("../subSchemas/FinancialAccountRef");
const PaymentMethodRefSchema = require("../subSchemas/PaymentMethodRef");


const CustomerBillSchema = new mongoose.Schema({
  id: String,
  href: String,
  billNo: String,
  amountDue: MoneySchema,
  appliedPayment: [AppliedPaymentSchema],
  billCycle: RefSchema,
  billDate: Date,
  billDocument: [AttachmentSchema],
  billingAccount:BillingAccountRefSchema,
  billingPeriod: TimePeriodSchema,
  category: String,
  financialAccount: FinancialAccountRefSchema,
  lastUpdate: Date,
  nextBillDate: Date,
  paymentDueDate: Date,
  paymentMethod: PaymentMethodRefSchema,
  relatedParty: [RelatedPartySchema],
  remainingAmount: MoneySchema,
  runType: {
    type: String,
    enum: ["onCycle", "offCycle"]
  },
  state: {
    type: String,
    enum: ["new", "validated", "sent", "settled", "partiallySettled", "onHold"]
  },
  taxExcludedAmount: MoneySchema,
  taxIncludedAmount: MoneySchema,
  taxItem: [TaxItemSchema],
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String,

  // Recycle fields
  isDeleted: {
    type: Boolean,
    default: false
  },
  deletedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model("CustomerBill", CustomerBillSchema, "CustomerBill");
