import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from '../types';

const productSchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      maxlength: [100, 'Name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please add a category'],
      enum: [
        'Electronics',
        'Books',
        'Clothing',
        'Home',
        'Sports',
        'Other',
      ],
    },
    stockCount: {
      type: Number,
      required: [true, 'Please add the stock count'],
      min: [0, 'Stock count cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Export the model and return your IProduct interface
export default mongoose.model<IProduct>('Product', productSchema);
