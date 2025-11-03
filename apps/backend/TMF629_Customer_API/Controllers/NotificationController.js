const EventHub = require('../Models/EventHub');

exports.saveEvent = async (req, res) => {
    try {
        const { "@type": type, eventId, eventTime, event } = req.body;

        if (!type || !eventId || !eventTime || !event) {
            return res.status(400).json({ message: "Invalid event structure" });
        }

        await EventHub.create({
            eventId,
            eventType: type,
            eventTime,
            event
        });

        console.log(`🔔 Event stored in DB: ${eventId}`);

        res.status(201).json({ message: "Event stored successfully", eventId });
    } catch (err) {
        console.error("❌ Error saving event:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getAllEvents = async (req, res) => {
    try {
        const events = await EventHub.find().sort({ eventTime: -1 }).limit(50);
        res.status(200).json(events);
    } catch (err) {
        console.error("❌ Error fetching events:", err);
        res.status(500).json({ message: "Server error" });
    }
};


exports.getEventById = async (req, res) => {
    try {
        const { eventId } = req.params;
        const event = await EventHub.findOne({ eventId });
        if (!event) return res.status(404).json({ message: "Event not found" });
        res.status(200).json(event);
    } catch (err) {
        console.error("❌ Error fetching specific event:", err);
        res.status(500).json({ message: "Server error" });
    }
};
