import asyncHandler from 'express-async-handler';
import ProductOrder from '../models/ProductOrder.js';
import { v4 as uuidv4 } from 'uuid';
import mongoose from 'mongoose';

// @desc    Create a new product order
// @route   POST /tmf-api/productOrdering/v1/productOrder
// @access  Public
export const createProductOrder = asyncHandler(async (req, res) => {
  const { externalId, description, category, orderItem, relatedParty, relatedPlace, note } = req.body;

  // Process order items to include price information
  const processedOrderItems = orderItem.map(item => {
    // If price is already provided in the request, use it
    if (item.price) {
      return item;
    }
    
    // Log the product data for debugging
    console.log('Processing order item:', JSON.stringify(item, null, 2));
    
    // If product has a price in productOfferingPrice, use it
    if (item.product?.productOfferingPrice?.length > 0) {
      const priceInfo = item.product.productOfferingPrice[0];
      console.log('Found price info:', JSON.stringify(priceInfo, null, 2));
      
      // Handle different possible price structures
      const priceData = priceInfo.price || priceInfo;
      
      return {
        ...item,
        price: {
          amount: priceData.amount || priceData.value || 0,
          currency: priceData.currency || 'USD',
          taxIncludedAmount: priceData.taxIncludedAmount,
          dutyFreeAmount: priceData.dutyFreeAmount,
          taxRate: priceData.taxRate,
          priceType: priceInfo.priceType || 'oneTime',
          name: priceInfo.name || 'Product Price',
          description: priceInfo.description,
          // Include the entire price object for reference
          originalPriceData: priceInfo
        }
      };
    }
    
    // If no price information is available, log a warning and set default values
    console.warn(`No price information found for product: ${item.product?.id || 'unknown'}`);
    return {
      ...item,
      price: {
        amount: 0,
        currency: 'USD',
        priceType: 'oneTime',
        name: 'Default Price',
        description: 'Price not found in product offering',
        isEstimated: true
      }
    };
  });

  const productOrder = await ProductOrder.create({
    id: uuidv4(),
    externalId,
    description,
    category,
    state: 'acknowledged',
    orderItem: processedOrderItems,
    relatedParty,
    relatedPlace,
    note,
    baseType: 'ProductOrder',
    schemaLocation: 'https://github.com/tmforum-rand/schemas/blob/ProductOrdering/ProductOrder.schema.json'
  });

  res.status(201).json(productOrder);
});

// @desc    Get all product orders
// @route   GET /tmf-api/productOrdering/v1/productOrder
// @access  Public
export const getProductOrders = asyncHandler(async (req, res) => {
  const { state, externalId } = req.query;

  const filter = {};
  if (state) filter.state = state;
  if (externalId) filter.externalId = externalId;

  const productOrders = await ProductOrder.find(filter);

  res.json({
    status: 'success',
    count: productOrders.length,
    productOrder: productOrders
  });
});

// @desc    Get single product order
// @route   GET /tmf-api/productOrdering/v1/productOrder/:id
// @access  Public
export const getProductOrder = asyncHandler(async (req, res) => {
  const productOrder = await ProductOrder.findOne({ id: req.params.id });

  if (!productOrder) {
    res.status(404);
    throw new Error('Product order not found');
  }

  res.json(productOrder);
});

// @desc    Update product order
// @route   PATCH /tmf-api/productOrdering/v1/productOrder/:id
// @access  Public
export const updateProductOrder = asyncHandler(async (req, res) => {
  const { state, note } = req.body;

  const productOrder = await ProductOrder.findOne({ id: req.params.id });

  if (!productOrder) {
    res.status(404);
    throw new Error('Product order not found');
  }

  if (state) productOrder.state = state;
  if (note) productOrder.note = [...(productOrder.note || []), note];

  const updatedProductOrder = await productOrder.save();

  res.json(updatedProductOrder);
});

// @desc    Delete product order
// @route   DELETE /tmf-api/productOrdering/v1/productOrder/:id
// @access  Public
export const deleteProductOrder = asyncHandler(async (req, res) => {
  const productOrder = await ProductOrder.findOne({ id: req.params.id });

  if (!productOrder) {
    res.status(404);
    throw new Error('Product order not found');
  }

  await ProductOrder.deleteOne({ id: req.params.id });

  res.json({ message: 'Product order removed' });
});

// @desc    Get product orders by customer ID
// @route   GET /tmf-api/productOrdering/v1/productOrder/byCustomer/:customerId
// @access  Public
// Get orders by customer ID
export const getProductOrdersByCustomer = asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Validate input
  if (!customerId) {
    return res.status(400).json({ message: "Customer ID is required" });
  }

  // Fetch orders that include this customer in relatedParty
  const productOrders = await ProductOrder.find({
    relatedParty: {
      $elemMatch: { id: customerId, role: "customer" },
    },
  }).lean(); // ✅ use lean() for faster performance (no Mongoose document overhead)

  // Handle empty result
  if (!productOrders?.length) {
    return res.status(404).json({ message: "No orders found for this customer" });
  }

  // ✅ Format and clean response
  const formattedOrders = productOrders.map((order) => ({
    id: order.id,
    customerId,
    state: order.state,
    orderDate: order.orderDate?.$date ?? order.orderDate ?? null,
    orderItems: (order.orderItem || []).map((item) => ({
      id: item.id,
      productName: item.product?.name ?? "Unknown Product",
      quantity: item.quantity ?? 1,
    })),
    address: order.relatedPlace?.[0]?.name ?? "Unknown",
    type: order.note?.[0]?.text ?? "Unknown",
  }));


  return res.status(200).json(formattedOrders);
});

