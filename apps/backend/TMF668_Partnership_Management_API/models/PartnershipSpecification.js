
// PartnershipSpecification.js
// TMF668 PartnershipSpecification Mongoose model

const mongoose = require('mongoose');

// RoleSpecificationSchema defines the structure for each role in a partnership template
const RoleSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the role (e.g., Buyer, Seller)
  description: String, // Description of the role
  requiresBilling: Boolean, // Does this role require a billing account?
  requiresSettlement: Boolean // Does this role require a settlement account?
});

// PartnershipSpecificationSchema defines the template for partnerships
const PartnershipSpecificationSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Name of the partnership specification (template)
  description: String, // Description of the specification
  roleSpecification: [RoleSpecificationSchema], // List of roles involved in this partnership
  agreementSpecification: [{ type: String }], // References to agreement specifications (can be ObjectId if integrated)
  href: String // URL reference to this resource (optional)
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the model so it can be used in routes/controllers
module.exports = mongoose.model('PartnershipSpecification', PartnershipSpecificationSchema);
