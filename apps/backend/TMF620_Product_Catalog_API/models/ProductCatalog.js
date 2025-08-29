const mongoose = require('mongoose');

const ProductCatalogSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  href: String,
  name: { type: String, required: true },
  description: String,
  lastUpdate: { type: Date, required: true },
  lifecycleStatus: { type: String, required: true },
  version: String,
  validFor: {
    startDateTime: Date,
    endDateTime: Date
  },
  category: [Object],
  relatedParty: [Object],
  '@type': { type: String, required: true }
});

module.exports = mongoose.model('ProductCatalog', ProductCatalogSchema);