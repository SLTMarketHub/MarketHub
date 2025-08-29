const mongoose = require('mongoose');

const PartnershipRoleSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  requiresBilling: { type: Boolean },
  requiresSettlement: { type: Boolean },
  agreementSpecification: [
    {
      id: { type: String },
      name: { type: String },
    },
  ],
});

const PartnershipSpecificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String },
  roleSpecification: [PartnershipRoleSpecificationSchema],
}, { timestamps: true });

module.exports = mongoose.model('PartnershipSpecification', PartnershipSpecificationSchema); 