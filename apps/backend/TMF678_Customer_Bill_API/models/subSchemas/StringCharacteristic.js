const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship');


const StringCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: [CharacteristicRelationshipSchema], 
  id: { type: String },      
  name: { type: String },      
  value: { type: String },    
  valueType: { type: String }, 
  "@baseType": { type: String },
  "@schemaLocation": { type: String },
  "@type": { type: String }
}, { _id: false });

module.exports = StringCharacteristicSchema;