const mongoose = require('mongoose');
const TimePeriodSchema = require('./TimePeriod');

const AttachmentSchema = new mongoose.Schema({
  attachmentType: String,
  content: String, 
  description: String,
  href: String,
  id: String,
  mimeType: String,
  name: String,
  size: Number,
  url: String,
  validFor: TimePeriodSchema,
  "@baseType": String,
  "@schemaLocation": String,
  "@type": String
}, { _id: false });

module.exports = AttachmentSchema;
