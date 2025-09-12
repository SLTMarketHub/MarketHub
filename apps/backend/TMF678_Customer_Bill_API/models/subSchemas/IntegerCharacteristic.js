const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship'); 

const IntegerCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: [CharacteristicRelationshipSchema], 
  id: { type: String },
  name: { type: String }, 
  value: { type: Number, integer: true }, 
  valueType: { type: String }, 
  "@baseType": { type: String },
  "@schemaLocation": { type: String },
  "@type": { type: String } 
}, { _id: false });

module.exports = IntegerCharacteristicSchema;
