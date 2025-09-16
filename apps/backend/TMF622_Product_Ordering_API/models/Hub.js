import mongoose from 'mongoose';

const hubSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  callback: { type: String, required: true },
  query: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
  baseType: { type: String, default: 'Hub' },
  schemaLocation: { type: String, default: 'https://github.com/tmforum-rand/schemas/blob/Common/Hub.schema.json' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for generating the URL
hubSchema.virtual('url').get(function() {
  return `/tmf-api/productOrdering/v1/hub/${this._id}`;
});

// Ensure virtuals are included when converting to JSON
hubSchema.set('toJSON', { virtuals: true });
hubSchema.set('toObject', { virtuals: true });

const Hub = mongoose.model('Hub', hubSchema);

export default Hub;
