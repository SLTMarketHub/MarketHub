const mongoose = require("mongoose");

const BilCycleSpecificationRef = new mongoose.Schema({
  id: String,
  href: String,
  name: String,
  description: String,
  "@baseType": String,
  "@referredType": String,
  "@schemaLocation": String,
  "@type": String
}, { _id: false });

module.exports = BilCycleSpecificationRef;
