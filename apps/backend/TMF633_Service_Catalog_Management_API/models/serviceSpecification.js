const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const serviceSpecificationSchema = new mongoose.Schema({
  uuid: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  description: String,
  isBundle: { type: Boolean, default: false },
  lifecycleStatus: { type: String, default: 'Active' },
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ServiceSpecification', serviceSpecificationSchema);
