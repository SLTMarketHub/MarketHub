const mongoose = require('mongoose');

const ObjectCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: [CharacteristicRelationshipSchema], // array of relationships
  id: { type: String },   
  name: { type: String }, 
  value: { type: mongoose.Schema.Types.Mixed },
  valueType: { type: String },  
  "@baseType": { type: String },
  "@schemaLocation": { type: String },
  "@type": { type: String }
}, { _id: false });

module.exports = ObjectCharacteristicSchema;
