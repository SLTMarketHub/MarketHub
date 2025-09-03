const EventHub = require('../Models/EventHub');

exports.registerListener = async (req, res) => {
    try {
        const { callback } = req.body;
        if (!callback) {
            return res.status(400).json({ message: "Callback URL is required" });
        }

        const existing = await EventHub.findOne({ callback });
        if (existing) {
            return res.status(409).json({ message: "Listener already registered" });
        }

        const newHub = await EventHub.create({ callback });
        res.status(201)
            .location(`/hub/${newHub._id}`)
            .json({ id: newHub._id, callback: newHub.callback });
    } catch (err) {
        console.error('❌ Error registering listener:', err.message);
        res.status(500).json({ error: "Server error" });
    }
};

exports.unregisterListener = async (req, res) => {
    try {
        const { id } = req.params;

        const deleted = await EventHub.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ message: "Listener not found" });
        }

        res.status(204).end();
    } catch (err) {
        console.error('❌ Error unregistering listener:', err.message);
        res.status(500).json({ error: "Server error" });
    }
};
