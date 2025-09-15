const mongoose = require('mongoose');

const PartyRefSchema = new mongoose.Schema({
  href: String,             
  id: String,               
  name: String,             
  "@baseType": String,       
  "@referredType": String,   
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = PartyRefSchema;
