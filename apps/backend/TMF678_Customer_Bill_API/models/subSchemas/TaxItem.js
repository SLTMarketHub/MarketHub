const mongoose = require('mongoose');
const MoneySchema = require('./Money');

const TaxItemSchema = new mongoose.Schema({
  taxAmount: MoneySchema,
  taxCategory: String,
  taxRate: Number,
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String
}, { _id: false });

module.exports = TaxItemSchema;
