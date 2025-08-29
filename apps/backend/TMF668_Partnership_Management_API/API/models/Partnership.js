const mongoose = require('mongoose');

const EngagedPartySchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  role: { type: String },
  '@referredType': { type: String },
}, { _id: false });

const PartnerSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  status: { type: String },
  statusReason: { type: String },
  engagedParty: EngagedPartySchema,
  account: { type: mongoose.Schema.Types.Mixed },
  agreement: { type: mongoose.Schema.Types.Mixed },
  relatedParty: { type: mongoose.Schema.Types.Mixed },
  creditProfile: { type: mongoose.Schema.Types.Mixed },
  contactMedium: { type: mongoose.Schema.Types.Mixed },
}, { _id: false });

const SpecificationRefSchema = new mongoose.Schema({
  id: { type: String, required: true },
  href: { type: String, required: true },
  name: { type: String, required: true },
}, { _id: false });

const PartnershipSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  specification: { type: SpecificationRefSchema, required: true },
  partner: [PartnerSchema],
}, { timestamps: true });

module.exports = mongoose.model('Partnership', PartnershipSchema); 