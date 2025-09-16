import express from 'express';
import {
  createCancelProductOrder,
  getCancelProductOrders,
  getCancelProductOrder,
  updateCancelProductOrder,
  deleteCancelProductOrder
} from '../controllers/cancelProductOrderController.js';

const router = express.Router();

// Base path: /tmf-api/productOrdering/v1/cancelProductOrder

// Create a new cancel product order
router.post('/', createCancelProductOrder);

// Get all cancel product orders with optional filtering
router.get('/', getCancelProductOrders);

// Get a single cancel product order by ID
router.get('/:id', getCancelProductOrder);

// Update a cancel product order
router.patch('/:id', updateCancelProductOrder);

// Delete a cancel product order
router.delete('/:id', deleteCancelProductOrder);

export default router;
