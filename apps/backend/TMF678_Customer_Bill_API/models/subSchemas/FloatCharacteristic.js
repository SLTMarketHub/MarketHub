const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship').CharacteristicRelationshipSchema;

const FloatCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: { type: CharacteristicRelationshipSchema },
  id: { type: String },
  name: { type: String },
  value: { type: Number }, 
  valueType: { type: String },
  "@baseType": { type: String },
  "@schemaLocation": { type: String },
  "@type": { type: String }
}, { _id: false });

module.exports = {
  FloatCharacteristicSchema, CharacteristicRelationshipSchema
};