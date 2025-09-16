const mongoose = require('mongoose');

const RefSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  href: String,
  name: String,
  "@type": String,
  "@schemaLocation": String,
  "@baseType": String,
  "@referredType": String
}, { _id: false });

module.exports = RefSchema;
