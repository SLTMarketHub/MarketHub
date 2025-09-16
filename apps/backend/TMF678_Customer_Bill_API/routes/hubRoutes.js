// routes/hubRoutes.js
const express = require("express");
const router = express.Router();
const hubController = require("../controllers/HubController");

router.post("/", hubController.registerListener);
router.patch("/:id", hubController.updateListener);
router.delete("/:id", hubController.unregisterListener);

module.exports = router;
