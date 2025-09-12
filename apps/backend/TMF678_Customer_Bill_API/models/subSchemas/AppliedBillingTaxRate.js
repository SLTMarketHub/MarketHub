const mongoose = require('mongoose');
const MoneySchema = require('../subSchemas/Money');  // Assuming you have Money schema

const AppliedBillingTaxRateSchema = new mongoose.Schema({
  href: String,             
  id: String,                
  taxAmount: MoneySchema,    
  taxCategory: String,       
  taxRate: Float,          
  "@baseType": String,       
  "@schemaLocation": String, 
  "@type": String            
}, { _id: false });

module.exports = AppliedBillingTaxRateSchema;
