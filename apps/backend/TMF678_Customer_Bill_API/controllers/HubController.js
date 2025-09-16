const Hub = require("../models/Hub");

// Register a listener
exports.registerListener = async (req, res) => {
  try {
    const { callback, query } = req.body;

    // Optionally check if multiple listeners are allowed
    const existing = await Hub.findOne({ callback });
    if (existing) {
      return res.status(409).json({ message: "Listener already exists" });
    }

    const hub = new Hub({ callback, query });
    await hub.save();

    res.status(201).json({ id: hub._id, callback: hub.callback, query: hub.query });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//update a listener
exports.updateListener = async (req, res) => {
  try {
    const { id } = req.params;
    const { callback, query } = req.body;

    const updated = await Hub.findByIdAndUpdate(
      id,
      { callback, query },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Listener not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Unregister a listener
exports.unregisterListener = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Hub.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ message: "Listener not found" });

    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
