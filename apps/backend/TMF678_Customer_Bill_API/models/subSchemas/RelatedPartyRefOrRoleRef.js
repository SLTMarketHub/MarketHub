const mongoose = require('mongoose');


const RelatedPartyRefOrPartyRoleRefSchema = new mongoose.Schema({
  partyOrPartyRole: {
    type: mongoose.Schema.Types.Mixed, // Can hold either PartyRef or PartyRoleRef object
    required: true
  },
  role: {
    type: String,
    required: false 
  },
  "@baseType": {
    type: String
  },
  "@schemaLocation": {
    type: String
  },
  "@type": {
    type: String
  }
}, { _id: false });

module.exports = RelatedPartyRefOrPartyRoleRefSchema;
