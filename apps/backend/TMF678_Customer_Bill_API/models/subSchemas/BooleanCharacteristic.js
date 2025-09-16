const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship'); // Importing the CharacteristicRelationship schema


const BooleanCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: CharacteristicRelationshipSchema, 
  id: {
    type: String
  },
  name: {
    type: String
  },
  value: {
    type: Boolean
  },
  valueType: {
    type: String
  },
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String
}, { _id: false });

module.exports = BooleanCharacteristicSchema;
