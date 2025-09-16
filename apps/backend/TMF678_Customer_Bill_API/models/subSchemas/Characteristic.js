const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship'); // Importing the CharacteristicRelationship schema

const CharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: CharacteristicRelationshipSchema, 
  id: { type: String },         
  name: { type: String },        
  valueType: { type: String },   
  "@baseType": { type: String },
  "@schemaLocation": { type: String }, 
  "@type": { type: String }      
}, { _id: false });

module.exports = CharacteristicSchema;