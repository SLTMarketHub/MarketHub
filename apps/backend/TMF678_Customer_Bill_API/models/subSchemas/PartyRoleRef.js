const mongoose = require('mongoose');

const PartyRoleRefSchema = new mongoose.Schema({
  href: String,              
  id: String,              
  name: String,             
  partyId: String,           
  partyName: String,         
  "@baseType": String,       
  "@referredType": String,   
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = PartyRoleRefSchema;
