const express = require('express');
const router = express.Router();
const controller = require('../controllers/productSpecificationController');

router.post('/productSpecification', controller.createProductSpecification);
router.get('/productSpecification', controller.getAllProductSpecifications);
router.get('/productSpecification/:id', controller.getProductSpecificationById);
router.patch('/productSpecification/:id', controller.updateProductSpecification);
router.delete('/productSpecification/:id', controller.deleteProductSpecification);

module.exports = router;
