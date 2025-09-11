import { Router, Request, Response, NextFunction } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';
import { validateRequest, productValidationRules } from '../middleware/validation';
import Product from '../models/Product';
import { ApiError } from '../middleware/errorHandler';
import { IProduct } from '../types';

const router = Router();

// Get all products
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (err) {
    next(err);
  }
});

// Get single product
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid product ID');
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (err) {
    next(err);
  }
});

// Create new product
router.post(
  '/',
  productValidationRules.createProduct,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const product = await Product.create(req.body);
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (err) {
      next(err);
    }
  }
);

// Update product
router.put(
  '/:id',
  productValidationRules.updateProduct,
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        throw new ApiError(400, 'Invalid product ID');
      }
      
      const product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      if (!product) {
        throw new ApiError(404, 'Product not found');
      }

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (err) {
      next(err);
    }
  }
);

// Delete product
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw new ApiError(400, 'Invalid product ID');
    }
    
    const product = await Product.findByIdAndDelete(req.params.id);
    
    if (!product) {
      throw new ApiError(404, 'Product not found');
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
});

export default router;
