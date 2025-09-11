const mongoose = require('mongoose');

const BillingAccountRefSchema = new mongoose.Schema({
  href: String,              
  id: String,                
  name: String,             
  ratingType: String,        
  "@baseType": String,       
  "@referredType": String,   
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = BillingAccountRefSchema;
