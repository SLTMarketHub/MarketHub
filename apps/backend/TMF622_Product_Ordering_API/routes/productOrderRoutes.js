import express from 'express';
import {
  createProductOrder,
  getProductOrders,
  getProductOrder,
  updateProductOrder,
  deleteProductOrder
} from '../controllers/productOrderController.js';

const router = express.Router();

// Base path: /tmf-api/productOrdering/v1/productOrder

// Create a new product order
router.post('/', createProductOrder);

// Get all product orders with optional filtering
router.get('/', getProductOrders);

// Get a single product order by ID
router.get('/:id', getProductOrder);

// Update a product order
router.patch('/:id', updateProductOrder);

// Delete a product order
router.delete('/:id', deleteProductOrder);

export default router;
