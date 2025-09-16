const mongoose = require('mongoose');

const CustomerBillRefSchema = new mongoose.Schema({
  href: String,              
  id: String,                
  name: String,             
  "@baseType": String,       
  "@referredType": String,    
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = CustomerBillRefSchema;
