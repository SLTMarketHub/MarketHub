const express = require("express");
const router = express.Router();
const controller = require("../controllers/appliedCustomerBillingRateController");

// List all AppliedCustomerBillingRates, support fields query param
router.get("/", controller.getAllAppliedCustomerBillingRates);

// Retrieve single AppliedCustomerBillingRate by id, support fields query param
router.get("/:id", controller.getAppliedCustomerBillingRateById);

// Create a new AppliedCustomerBillingRate
router.post("/", controller.createAppliedCustomerBillingRate);

// Update an existing AppliedCustomerBillingRate by ID
router.patch("/:id", controller.updateAppliedCustomerBillingRate);

// Delete an AppliedCustomerBillingRate by ID
router.delete("/:id", controller.deleteAppliedCustomerBillingRate);



module.exports = router;
