const express = require('express');
const router = express.Router();
const controller = require('../controllers/productOfferingPriceController');

router.post('/productOfferingPrice', controller.createProductOfferingPrice);
router.get('/productOfferingPrice', controller.getAllProductOfferingPrices);
router.get('/productOfferingPrice/:id', controller.getProductOfferingPriceById);
router.patch('/productOfferingPrice/:id', controller.updateProductOfferingPrice);
router.delete('/productOfferingPrice/:id', controller.deleteProductOfferingPrice);

module.exports = router;
