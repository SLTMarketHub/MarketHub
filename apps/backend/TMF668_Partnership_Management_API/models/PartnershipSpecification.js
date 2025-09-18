const mongoose = require("mongoose");

const AgreementSpecificationRefSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  description: { type: String },
  href: { type: String },
  "@referredType": { type: String }
}, { _id: false });

const RoleSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  requiresBilling: { type: Boolean, default: false },
  requiresSettlement: { type: Boolean, default: false },
  agreementSpecification: [AgreementSpecificationRefSchema]
}, { _id: false });

const PartnershipSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  href: { type: String },
  roleSpecification: [RoleSpecificationSchema]
}, { timestamps: true });

module.exports = mongoose.model("PartnershipSpecification", PartnershipSpecificationSchema);
