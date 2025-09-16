const CustomerBillOnDemand = require("../models/mainmodels/CustomerBillOnDemand");
const { createNotification } = require("../utils/notificationHelper");


// Fetch all CustomerBillOnDemand (excluding deleted if needed)
exports.getAllBillsOnDemand = async (req, res) => {
  try {
    const bills = await CustomerBillOnDemand.find({ isDeleted: false });
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific CustomerBillOnDemand by ID
exports.getBillOnDemandById = async (req, res) => {
  try {
    const { id } = req.params;
    const bill = await CustomerBillOnDemand.findOne({ id, isDeleted: false });
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllBillsOnDemandFields = async (req, res) => {
  try {
    const { fields } = req.query; 
    let projection = {};

    if (fields) {
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1; // include field
      });
    }

    const bills = await CustomerBillOnDemand.find({ isDeleted: false }, projection);
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Create a new CustomerBillOnDemand
exports.createBillOnDemand = async (req, res) => {
  try {
    const bill = new CustomerBillOnDemand(req.body);
    const savedBill = await bill.save();

    // 🔔 Notification on create
    await createNotification(
      "CustomerBillOnDemandCreateEvent",
      savedBill,
      "customerBillOnDemand",
      "Customer Bill On-Demand created"
    );

    res.status(201).json(savedBill);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update CustomerBillOnDemand partially
exports.updateBillOnDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const patchData = req.body;

    const updatedBill = await CustomerBillOnDemand.findOneAndUpdate(
      { id },
      { $set: patchData },
      { new: true, runValidators: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // 🔔 Notification if state is updated
    if (patchData.state) {
      await createNotification(
        "CustomerBillOnDemandStateChangeEvent",
        updatedBill,
        "customerBillOnDemand",
        "Customer Bill On-Demand state changed"
      );
    }

    res.json({ message: "Bill On-Demand details updated!", bill: updatedBill });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Soft-delete CustomerBillOnDemand
exports.deleteBillOnDemand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBill = await CustomerBillOnDemand.findOneAndUpdate(
      { id, isDeleted: false },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!deletedBill) {
      return res.status(404).json({ message: "Bill not found or already deleted" });
    }

    // 🔔 Notification on delete
    await createNotification(
      "CustomerBillOnDemandDeleteEvent",
      deletedBill,
      "customerBillOnDemand",
      "Customer Bill On-Demand deleted"
    );

    res.status(404).json({ message: "Bill On-Demand deleted successfully!" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
