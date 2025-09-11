// Partnership.js
// TMF668 Partnership Mongoose model

const mongoose = require('mongoose');


// Sub-document for Partner
const PartnerSchema = new mongoose.Schema({
  engagedParty: {
    type: String, // Reference to Party (could be ObjectId if integrated)
    required: [true, 'engagedParty is required']
  },
  role: {
    type: String,
    required: [true, 'role is required']
  },
  account: String, // Reference to Account (could be ObjectId)
  agreement: String, // Reference to Agreement (could be ObjectId)
  paymentMethod: String,
  contactMedium: String,
  creditProfile: String
});

// Validity period sub-document
const ValidForSchema = new mongoose.Schema({
  startDateTime: {
    type: Date,
    required: [true, 'validFor.startDateTime is required']
  },
  endDateTime: Date // Optional
});

// Partnership main schema
const PartnershipSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
    validate: {
      validator: function(v) {
        return typeof v === 'string';
      },
      message: 'name must be a string'
    }
  }, // Partnership name
  description: {
    type: String,
    maxlength: [500, 'description cannot exceed 500 characters']
  }, // Partnership description
  specification: {
    type: String,
    required: [true, 'specification is required']
  }, // Reference to PartnershipSpecification
  partner: {
    type: [PartnerSchema],
    validate: [arr => arr.length > 0, 'At least one partner is required']
  }, // List of partners in this partnership
  status: {
    type: String,
    enum: ['active', 'terminated', 'pending'],
    default: 'pending'
  }, // Partnership status
  validFor: ValidForSchema, // Validity period
  href: String // URL reference to this resource (optional)
}, { timestamps: true });

module.exports = mongoose.model('Partnership', PartnershipSchema);
