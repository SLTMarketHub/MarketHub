const EventHub = require('./Models/EventHub');

module.exports = (app) => {

    app.post("/client/listener", async (req, res) => {
        try {
            const { "@type": type, eventId, eventTime, event } = req.body;

            if (!type || !eventId || !eventTime || !event) {
                return res.status(400).send("Invalid event structure");
            }

            await EventHub.create({
                eventId,
                eventType: type,
                eventTime,
                event
            });

            console.log(`🔔 Event stored in DB: ${eventId}`);

            res.status(201).send("✅ Event stored in EventHub DB");
        } catch (err) {
            console.error("❌ Error saving event:", err);
            res.status(500).send("Error saving event");
        }
    });
};

