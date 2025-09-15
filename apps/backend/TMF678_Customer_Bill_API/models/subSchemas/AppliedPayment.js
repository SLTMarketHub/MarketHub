const mongoose = require('mongoose');
const MoneySchema = require('./Money');
const PaymentRefSchema = require('./PaymentRef');

const AppliedPaymentSchema = new mongoose.Schema({
  appliedAmount: MoneySchema,
  payment: PaymentRefSchema,
  
}, { _id: false });

module.exports = AppliedPaymentSchema;
