const mongoose = require('mongoose');
const CharacteristicRelationshipSchema = require('./CharacteristicRelationship'); 

const ObjectArrayCharacteristicSchema = new mongoose.Schema({
  characteristicRelationship: [CharacteristicRelationshipSchema], 
  id: { type: String },                                            
  name: { type: String },                                          
  value: { type: mongoose.Schema.Types.Mixed },                  
  valueType: { type: String },                                     
  "@baseType": { type: String },                                   
  "@schemaLocation": { type: String },                            
  "@type": { type: String }                                        
}, { _id: false });

module.exports = ObjectArrayCharacteristicSchema;