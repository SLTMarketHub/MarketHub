const express = require('express');
const router = express.Router();
const controller = require('../controllers/productCatalogController');

router.post('/productCatalog', controller.createCatalog);
router.get('/productCatalog', controller.getCatalogs);
router.get('/productCatalog/:id', controller.getCatalogById);
router.patch('/productCatalog/:id', controller.updateCatalog);
router.delete('/productCatalog/:id', controller.deleteCatalog);

module.exports = router;