const mongoose = require("mongoose");

const RelatedPartySchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  role: { type: String },
  href: { type: String },
  "@referredType": { type: String }
}, { _id: false });

const AccountRefSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  description: { type: String },
  href: { type: String },
  "@referredType": { type: String }
}, { _id: false });

const AgreementRefSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  href: { type: String },
  "@referredType": { type: String }
}, { _id: false });

const PartnerSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  status: { type: String, enum: ["Active", "Inactive", "Pending", "Rejected"], default: "Pending" },
  statusReason: { type: String },
  engagedParty: RelatedPartySchema,
  account: [AccountRefSchema],
  agreement: [AgreementRefSchema]
}, { _id: false });

const PartnershipSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  href: { type: String },
  specification: {
    id: { type: String },
    name: { type: String },
    href: { type: String },
    "@referredType": { type: String }
  },
  partner: [PartnerSchema]
}, { timestamps: true });

module.exports = mongoose.model("Partnership", PartnershipSchema);
