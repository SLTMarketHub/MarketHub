const mongoose = require('mongoose');

const serviceCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  lastUpdate: { type: Date, default: Date.now },
  lifecycleStatus: { type: String, default: 'Active' },
}, { timestamps: true });

module.exports = mongoose.model('ServiceCategory', serviceCategorySchema);
