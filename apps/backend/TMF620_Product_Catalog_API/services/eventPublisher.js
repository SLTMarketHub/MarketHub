const axios = require('axios');
const EventHub = require('../models/EventHub');

async function publishEvent(eventType, resourceType, payload) {
  try {
    const hubs = await EventHub.find();
    
    if (hubs.length === 0) {
      return; // No event hubs configured, exit early to save memory
    }

    const eventBody = {
      eventId: `${resourceType}-${payload.id}-${Date.now()}`,
      eventType,
      eventTime: new Date().toISOString(),
      resource: resourceType,
      data: payload
    };

    // Create axios instance with timeout to prevent hanging requests and memory leaks
    const axiosInstance = axios.create({
      timeout: 5000, // 5 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Use Promise.allSettled with timeout to prevent memory accumulation
    await Promise.allSettled(
      hubs.map(h => 
        axiosInstance.post(h.callback, eventBody).catch(err => {
          // Log error only in development to avoid memory issues from error objects
          if (process.env.NODE_ENV === 'development') {
            console.warn(`Event publishing failed for hub ${h.callback}:`, err.message);
          }
          return null;
        })
      )
    );
  } catch (_err) {
    // best-effort; do not throw
    // Log only in development to avoid memory issues from error objects
    if (process.env.NODE_ENV === 'development') {
      console.warn('Event publishing error:', _err.message);
    }
  }
}

module.exports = { publishEvent };


