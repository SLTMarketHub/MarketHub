// routes/hubRoutes.js
const express = require("express");
const router = express.Router();
const hubController = require("../controllers/HubController");

router.post("/hub", hubController.registerListener);
router.delete("/hub/:id", hubController.unregisterListener);

module.exports = router;
