
// PartnershipSpecification.js
// TMF668 PartnershipSpecification Mongoose model

const mongoose = require('mongoose');


// RoleSpecificationSchema defines the structure for each role in a partnership template
const RoleSpecificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'roleSpecification.name is required']
  }, // Name of the role (e.g., Buyer, Seller)
  description: {
    type: String,
    maxlength: [200, 'roleSpecification.description cannot exceed 200 characters']
  }, // Description of the role
  requiresBilling: {
    type: Boolean,
    default: false
  }, // Does this role require a billing account?
  requiresSettlement: {
    type: Boolean,
    default: false
  } // Does this role require a settlement account?
});

// PartnershipSpecificationSchema defines the template for partnerships
const PartnershipSpecificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required']
  }, // Name of the partnership specification (template)
  description: {
    type: String,
    maxlength: [500, 'description cannot exceed 500 characters']
  }, // Description of the specification
  roleSpecification: {
    type: [RoleSpecificationSchema],
    validate: [arr => arr.length > 0, 'At least one roleSpecification is required']
  }, // List of roles involved in this partnership
  agreementSpecification: [{ type: String }], // References to agreement specifications (can be ObjectId if integrated)
  href: String // URL reference to this resource (optional)
}, { timestamps: true }); // Adds createdAt and updatedAt fields automatically

// Export the model so it can be used in routes/controllers
module.exports = mongoose.model('PartnershipSpecification', PartnershipSpecificationSchema);
