import mongoose from 'mongoose';

const cancelProductOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  // href is now a virtual field only
  cancellationReason: String,
  effectiveCancellationDate: Date,
  requestedCancellationDate: { type: Date, default: Date.now },
  state: { 
    type: String, 
    required: true, 
    enum: ['acknowledged', 'rejected', 'inProgress', 'pending', 'completed', 'failed'] 
  },
  productOrder: {
    id: { type: String, required: true },
    href: String
  },
  baseType: { type: String, default: 'CancelProductOrder' },
  schemaLocation: { type: String, default: 'https://github.com/tmforum-rand/schemas/blob/ProductOrdering/CancelProductOrder.schema.json' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for generating the href
cancelProductOrderSchema.virtual('url').get(function() {
  return `/tmf-api/productOrdering/v1/cancelProductOrder/${this._id}`;
});

// Ensure virtuals are included when converting to JSON
cancelProductOrderSchema.set('toJSON', { virtuals: true });
cancelProductOrderSchema.set('toObject', { virtuals: true });

const CancelProductOrder = mongoose.model('CancelProductOrder', cancelProductOrderSchema);

export default CancelProductOrder;
