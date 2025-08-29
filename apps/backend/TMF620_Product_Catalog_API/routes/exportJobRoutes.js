const express = require('express');
const router = express.Router();
const exportJobController = require('../controllers/exportJobController');

router.post('/exportJob', exportJobController.createExportJob);
router.get('/exportJob', exportJobController.getExportJobs);
router.get('/exportJob/:id', exportJobController.getExportJobById);
router.delete('/exportJob/:id', exportJobController.deleteExportJob);

module.exports = router;
