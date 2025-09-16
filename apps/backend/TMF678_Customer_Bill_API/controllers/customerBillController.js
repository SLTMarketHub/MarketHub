const CustomerBill = require('../models/mainmodels/CustomerBill');
const { createNotification } = require("../utils/notificationHelper");


// Fetch all bill details (excluding deleted bills)
exports.getAllBills = async (req, res) => {
  try {
    const { fields } = req.query; 
    let projection = null;

    if (fields) {
      // Convert fields=field1,field2 to mongoose projection object {field1:1, field2:1}
      projection = {};
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    // Only fetch bills that are not deleted
    const bills = await CustomerBill.find({ isDeleted: false }, projection);
    res.json(bills);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET bill by ID with optional fields projection
exports.getBillById = async (req, res) => {
  try {
    const { id } = req.params;
    const { fields } = req.query;
    let projection = null;
    if (fields) {
      projection = {};
      fields.split(',').forEach(field => {
        projection[field.trim()] = 1;
      });
    }

    const bill = await CustomerBill.findOne({ id }, projection);
    if (!bill) return res.status(404).json({ message: 'Bill not found' });
    res.json(bill);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new CustomerBill
exports.createBill = async (req, res) => {
  try {
    const bill = new CustomerBill(req.body);
    const savedBill = await bill.save();  
    await createNotification("CustomerBillCreateEvent", savedBill, "customerBill", "Customer Bill created");

    
    res.status(201).json(savedBill);

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Update the bill details (partial update)
exports.updateBillPartial = async (req, res) => {
  try {
    const { id } = req.params;
    const patchData = req.body;

    const updatedBill = await CustomerBill.findOneAndUpdate(
      { id },
      { $set: patchData },
      { new: true, runValidators: true }
    );

    if (!updatedBill) {
      return res.status(404).json({ message: "Bill not found" });
    }

    // 🔔 Trigger notification only if "state" is being updated
    if (patchData.state) {
      await createNotification(
        "CustomerBillStateChangeEvent",
        updatedBill,
        "customerBill",
        "Customer Bill state changed"
      );
    }

    res.json({ message: 'Bill updated!',updatedBill});
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// Soft delete a CustomerBill
exports.deleteBill = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBill = await CustomerBill.findOneAndUpdate(
      { id, isDeleted: false }, // only update if not already deleted
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );

    if (!deletedBill) {
      return res.status(404).json({ message: 'Bill not found or already deleted' });
    }

    res.status(404).json({ message: 'Bill Deleted!'});
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Restore a deleted CustomerBill
exports.restoreBill = async (req, res) => {
  try {
    const { id } = req.params;

    const restoredBill = await CustomerBill.findOneAndUpdate(
      { id, isDeleted: true },
      { $set: { isDeleted: false, deletedAt: null } },
      { new: true }
    );

    if (!restoredBill) {
      return res.status(404).json({ message: 'Bill not found or not deleted' });
    }

    res.json({ message: 'Bill restored from recycle', bill: restoredBill });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


