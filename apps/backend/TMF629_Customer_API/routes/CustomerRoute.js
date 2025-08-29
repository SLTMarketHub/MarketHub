const express = require("express");
const router = express.Router();
const controller = require("../controller/CustomerController");

router.post("/", controller.createCustomer);
router.get("/", controller.getAllCustomers);
router.get("/:id", controller.getCustomerById);
router.patch("/:id", controller.updateCustomer);
router.delete("/:id", controller.deleteCustomer);

module.exports = router;
