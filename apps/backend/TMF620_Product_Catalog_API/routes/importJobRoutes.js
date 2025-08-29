const express = require('express');
const router = express.Router();
const importJobController = require('../controllers/importJobController');

router.post('/importJob', importJobController.createImportJob);
router.get('/importJob', importJobController.getImportJobs);
router.get('/importJob/:id', importJobController.getImportJobById);
router.delete('/importJob/:id', importJobController.deleteImportJob);

module.exports = router;
