const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship'); // Import the sub-schema

const NumberCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: [CharacteristicRelationshipSchema], // array of related characteristics
  id: String, 
  name: String, 
  value: Number, 
  valueType: String, 
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String
}, { _id: false });

module.exports = NumberCharacteristicSchema;