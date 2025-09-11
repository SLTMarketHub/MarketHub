const mongoose = require('mongoose');

const FinancialAccountRefSchema = new mongoose.Schema({
  href: String,              
  id: String,                
  name: String,              
  "@baseType": String,       
  "@referredType": String,   
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = FinancialAccountRefSchema;
