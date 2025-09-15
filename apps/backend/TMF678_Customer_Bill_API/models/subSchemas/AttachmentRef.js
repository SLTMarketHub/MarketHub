const mongoose = require('mongoose');

const AttachmentRefSchema = new mongoose.Schema({
  description: String,       
  href: String,              
  id: String,                
  name: String,             
  url: String,               
  "@baseType": String,     
  "@referredType": String,   
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = AttachmentRefSchema;
