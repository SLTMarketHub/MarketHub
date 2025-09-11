const axios = require('axios');
const EventHub = require('../models/EventHub');

async function publishEvent(eventType, resourceType, payload) {
  try {
    const hubs = await EventHub.find();
    const eventBody = {
      eventId: `${resourceType}-${payload.id}-${Date.now()}`,
      eventType,
      eventTime: new Date().toISOString(),
      resource: resourceType,
      data: payload
    };

    await Promise.allSettled(
      hubs.map(h => axios.post(h.callback, eventBody).catch(() => null))
    );
  } catch (_err) {
    // best-effort; do not throw
  }
}

module.exports = { publishEvent };


