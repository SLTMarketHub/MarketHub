const mongoose = require("mongoose");
const BillingAccountRefSchema = require("../subSchemas/BillingAccountRef");
const CustomerBillRefSchema = require("../subSchemas/CustomerBillRef");
const RelatedParty = require("../subSchemas/RelatedPartyRefOrRoleRef");


const CustomerBillOnDemandSchema = new mongoose.Schema({
  id: String,
  href: String,
  description: String,
  lastUpdate: Date,
  name: String,
  billingAccount: BillingAccountRefSchema,
  customerBill: CustomerBillRefSchema,
  relatedParty:[RelatedParty],
  state: {
    type: String,
    enum: ["inProgress", "rejected", "done", "terminatedWithError"]
  },
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


module.exports = mongoose.model("CustomerBillOnDemand", CustomerBillOnDemandSchema, "CustomerBillOnDemand");
