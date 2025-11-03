const EventHub = require('../Models/EventHub');

const buildEvent = (type, customer) => ({
    "@type": type,
    eventId: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
    eventTime: new Date().toISOString(),
    eventType: type,
    event: {
        customer
    }
});

exports.publishEvent = async (type, customer) => {
    try {
        const eventPayload = buildEvent(type, customer);

        await EventHub.create(eventPayload);

        console.log(`✅ Event stored in DB: ${eventPayload.eventId}`);
    } catch (err) {
        console.error("❌ Failed to store event in DB:", err.message);
    }
};
