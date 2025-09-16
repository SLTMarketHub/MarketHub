import mongoose from 'mongoose';

const productOrderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  // href is now a virtual field only
  externalId: String,
  priority: String,
  description: String,
  category: [String],
  state: { type: String, required: true, enum: ['acknowledged', 'rejected', 'inProgress', 'pending', 'held', 'completed', 'failed'] },
  orderDate: { type: Date, default: Date.now },
  requestedStartDate: Date,
  requestedCompletionDate: Date,
  expectedCompletionDate: Date,
  notificationContact: String,
  orderItem: [{
    id: String,
    action: { type: String, enum: ['add', 'modify', 'delete', 'noChange'] },
    product: {
      id: String,
      href: String,
      name: String
    },
    quantity: Number,
    state: String
  }],
  relatedParty: [{
    id: String,
    role: String,
    name: String,
    href: String
  }],
  relatedPlace: [{
    id: String,
    href: String,
    name: String,
    role: String
  }],
  note: [{
    text: String,
    date: Date,
    author: String
  }],
  baseType: { type: String, default: 'ProductOrder' },
  schemaLocation: { type: String, default: 'https://github.com/tmforum-rand/schemas/blob/ProductOrdering/ProductOrder.schema.json' }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for generating the href
productOrderSchema.virtual('url').get(function() {
  return `/tmf-api/productOrdering/v1/productOrder/${this._id}`;
});

// Ensure virtuals are included when converting to JSON
productOrderSchema.set('toJSON', { virtuals: true });
productOrderSchema.set('toObject', { virtuals: true });

const ProductOrder = mongoose.model('ProductOrder', productOrderSchema);

export default ProductOrder;
