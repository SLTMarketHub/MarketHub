import asyncHandler from 'express-async-handler';
import CancelProductOrder from '../models/CancelProductOrder.js';
import ProductOrder from '../models/ProductOrder.js';
import { v4 as uuidv4 } from 'uuid';

// @desc    Create a new cancel product order
// @route   POST /tmf-api/productOrdering/v1/cancelProductOrder
// @access  Public
export const createCancelProductOrder = asyncHandler(async (req, res) => {
  const { cancellationReason, productOrder } = req.body;
  
  // Check if the product order exists
  const order = await ProductOrder.findOne({ id: productOrder?.id });
  
  if (!order) {
    res.status(404);
    throw new Error('Product order not found');
  }
  
  const cancelProductOrder = await CancelProductOrder.create({
    id: uuidv4(),
    cancellationReason,
    productOrder: {
      id: order.id,
      href: order.href
    },
    state: 'inProgress',
    requestedCancellationDate: new Date(),
    baseType: 'CancelProductOrder',
    schemaLocation: 'https://github.com/tmforum-rand/schemas/blob/ProductOrdering/CancelProductOrder.schema.json'
  });
  
  // Update the product order state
  order.state = 'cancelled';
  await order.save();
  
  res.status(201).json(cancelProductOrder);
});

// @desc    Get all cancel product orders
// @route   GET /tmf-api/productOrdering/v1/cancelProductOrder
// @access  Public
export const getCancelProductOrders = asyncHandler(async (req, res) => {
  const { state } = req.query;
  
  const filter = {};
  if (state) filter.state = state;

  const cancelProductOrders = await CancelProductOrder.find(filter)
    .populate('productOrder', 'id href state');
  
  res.json({
    status: 'success',
    count: cancelProductOrders.length,
    cancelProductOrder: cancelProductOrders
  });
});

// @desc    Get single cancel product order
// @route   GET /tmf-api/productOrdering/v1/cancelProductOrder/:id
// @access  Public
export const getCancelProductOrder = asyncHandler(async (req, res) => {
  const cancelProductOrder = await CancelProductOrder.findOne({ id: req.params.id })
    .populate('productOrder', 'id href state');

  if (!cancelProductOrder) {
    res.status(404);
    throw new Error('Cancel product order not found');
  }

  res.json(cancelProductOrder);
});

// @desc    Update cancel product order
// @route   PATCH /tmf-api/productOrdering/v1/cancelProductOrder/:id
// @access  Public
export const updateCancelProductOrder = asyncHandler(async (req, res) => {
  const { state, effectiveCancellationDate } = req.body;
  
  const cancelProductOrder = await CancelProductOrder.findOne({ id: req.params.id });

  if (!cancelProductOrder) {
    res.status(404);
    throw new Error('Cancel product order not found');
  }

  if (state) cancelProductOrder.state = state;
  if (effectiveCancellationDate) cancelProductOrder.effectiveCancellationDate = effectiveCancellationDate;

  const updatedCancelProductOrder = await cancelProductOrder.save();
  
  res.json(updatedCancelProductOrder);
});

// @desc    Delete cancel product order
// @route   DELETE /tmf-api/productOrdering/v1/cancelProductOrder/:id
// @access  Public
export const deleteCancelProductOrder = asyncHandler(async (req, res) => {
  const cancelProductOrder = await CancelProductOrder.findOne({ id: req.params.id });

  if (!cancelProductOrder) {
    res.status(404);
    throw new Error('Cancel product order not found');
  }

  await CancelProductOrder.deleteOne({ id: req.params.id });
  
  res.json({ message: 'Cancel product order removed' });
});
