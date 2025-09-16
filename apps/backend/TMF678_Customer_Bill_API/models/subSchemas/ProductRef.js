const mongoose = require('mongoose');

const ProductRefSchema = new mongoose.Schema({
  href: { type: String },            
  id: { type: String },            
  name: { type: String },            
  "@baseType": { type: String },    
  "@referredType": { type: String },
  "@schemaLocation": { type: String }, 
  "@type": { type: String }          
}, { _id: false });                  

module.exports = ProductRefSchema;