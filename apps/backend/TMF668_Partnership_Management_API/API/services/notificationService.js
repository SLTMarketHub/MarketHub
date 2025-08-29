const listeners = [];

function registerHub(listener) {
  listeners.push(listener);
  return listener;
}

function removeHub(id) {
  const idx = listeners.findIndex(l => l.id === id);
  if (idx !== -1) listeners.splice(idx, 1);
}

function notify(eventType, resourceType, data) {
  // Mock delivery: log to console
  console.log(`[Notification] ${eventType} on ${resourceType}:`, data);
  // In real implementation, would POST to each listener
}

module.exports = { registerHub, removeHub, notify }; 