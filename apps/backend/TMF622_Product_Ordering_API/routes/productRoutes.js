import express from 'express';
import { validateRequest, productValidationRules } from '../middleware/validation.js';
import * as ctrl from '../controllers/productController.js';

const router = express.Router();

router.get('/', ctrl.listProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', productValidationRules.createProduct, validateRequest, ctrl.createProduct);
router.put('/:id', productValidationRules.updateProduct, validateRequest, ctrl.updateProduct);
router.delete('/:id', ctrl.deleteProduct);

export default router;


