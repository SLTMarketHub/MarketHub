const mongoose = require('mongoose');

const MoneySchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  "@type": String,
  "@schemaLocation": String,
  "@baseType": String
}, { _id: false });

module.exports = MoneySchema;
