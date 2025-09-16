const BillCycle = require('../models/mainmodels/BillCycle');

// GET all BillCycles
exports.getAllBillCycles = async (req, res) => {
    try {
        const billCycles = await BillCycle.find();
        res.json(billCycles);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



// GET BillCycle by ID
exports.getBillCycleById = async (req, res) => {
    try {
        const billCycle = await BillCycle.findOne({ id: req.params.id });
        if (!billCycle) return res.status(404).json({ message: 'BillCycle not found' });
        res.json(billCycle);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get BillCycles with only requested fields
exports.getSelectedBillCycleFields = async (req, res) => {
  try {
    // Example: /fields?fields=id,billingDate
    const fieldsQuery = req.query.fields;

    // If no fields are requested, return all fields
    const fields = fieldsQuery ? fieldsQuery.split(',').join(' ') : '';

    const billCycles = await BillCycle.find({}, fields);

    // Always return an array (empty if none found)
    res.json(billCycles);
  } catch (err) {
    console.error("Error fetching selected BillCycle fields:", err);
    res.status(500).json({ error: err.message });
  }
};



// CREATE new BillCycle
exports.createBillCycle = async (req, res) => {
    try {
        const billCycle = new BillCycle(req.body);
        await billCycle.save();
        console.log('New BillCycle created!');
        res.status(201).json(billCycle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// UPDATE BillCycle by custom "id" field
exports.updateBillCycle = async (req, res) => {
    try {
        const billCycle = await BillCycle.findOneAndUpdate(
            { id: req.params.id }, 
            req.body,
            { new: true }
        );
        if (!billCycle) {
            return res.status(404).json({ message: 'BillCycle not found' });
        }
        res.json({ message: " BillCycle Updated !" },billCycle);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


// DELETE BillCycle permanently
exports.deleteBillCycle = async (req, res) => {
  try {
    const deletedBillCycle = await BillCycle.findOneAndDelete({ id: req.params.id });
    if (!deletedBillCycle) return res.status(404).json({ message: 'BillCycle not found' });
    res.status(404).json({ message: 'BillCycle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
