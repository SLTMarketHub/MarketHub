const AppliedCustomerBillingRate = require("../models/mainmodels/AppliedCustomerBillingRate");

// GET list of AppliedCustomerBillingRate objects, only non-deleted
exports.getAllAppliedCustomerBillingRates = async (req, res) => {
  try {
    const fields = req.query.fields ? req.query.fields.split(",").join(" ") : null;

    const rates = await AppliedCustomerBillingRate.find(
      { isDeleted: false },
      fields
    );

    res.status(200).json(rates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// GET a single AppliedCustomerBillingRate by ID
exports.getAppliedCustomerBillingRateById = async (req, res) => {
  try {
    const { id } = req.params;
    const fields = req.query.fields ? req.query.fields.split(",").join(" ") : null;

    const rate = await AppliedCustomerBillingRate.findOne({ id }, fields);
    if (!rate) {
      return res.status(404).json({ message: "AppliedCustomerBillingRate not found" });
    }
    res.status(200).json(rate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE a new AppliedCustomerBillingRate
exports.createAppliedCustomerBillingRate = async (req, res) => {
  try {
    const data = req.body;

    // Generate defaults if not provided
    data.id = data.id || "ACBR" + Math.floor(Math.random() * 1000000);
    data.href = data.href || `http://localhost:5000/api/appliedCustomerBillingRate/${data.id}`;
    data["@type"] = data["@type"] || "AppliedCustomerBillingRate";

    const newRate = new AppliedCustomerBillingRate(data);
    await newRate.save();
    res.status(200).json({ message: " New AppliedCustomerBillingRate Created !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE an existing AppliedCustomerBillingRate by ID
exports.updateAppliedCustomerBillingRate = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedRate = await AppliedCustomerBillingRate.findOneAndUpdate(
      { id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRate) {
      return res.status(404).json({ message: "AppliedCustomerBillingRate not found" });
    }

    console.log(`AppliedCustomerBillingRate ${id} updated!`);
    res.status(200).json({ message: " AppliedCustomerBillingRate Updated !" },updatedRate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE (soft delete) an AppliedCustomerBillingRate by ID
exports.deleteAppliedCustomerBillingRate = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRate = await AppliedCustomerBillingRate.findOneAndUpdate(
      { id },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );


    console.log(`AppliedCustomerBillingRate ${id} deleted!`);
    res.status(404).json({ message: "AppliedCustomerBillingRate deleted !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


