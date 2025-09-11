const mongoose = require('mongoose');

const TimePeriodSchema = new mongoose.Schema({
  startDateTime: Date,
  endDateTime: Date,
  "@type": String,
  "@schemaLocation": String,
  "@baseType": String
}, { _id: false });

module.exports = TimePeriodSchema;
