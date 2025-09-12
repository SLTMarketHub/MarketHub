const mongoose = require('mongoose');

const CharacteristicRelationshipSchema = new mongoose.Schema({
  id: { type: String }, 
  relationshipType: { type: String }, 
  "@baseType": { type: String },
  "@schemaLocation": { type: String }, 
  "@type": { type: String } 
}, { _id: false }); 

module.exports = CharacteristicRelationshipSchema;
