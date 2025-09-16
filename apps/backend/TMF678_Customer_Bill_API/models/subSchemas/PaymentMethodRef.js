const mongoose = require('mongoose');

const PaymentMethodRefSchema = new mongoose.Schema({
  href: String,             
  id: String,                
  name: String,             
  "@baseType": String,       
  "@referredType": String,   
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = PaymentMethodRefSchema;
