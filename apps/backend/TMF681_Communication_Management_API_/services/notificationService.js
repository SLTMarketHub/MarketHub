import * as hubService from "./hubService.js";
import axios from "axios";

export async function publishEvent(eventType, eventBody) {
    const payload = {
        eventId: (Math.random() * 1e9).toFixed(0),
        eventTime: new Date().toISOString(),
        eventType,
        event: eventBody
    };

    const listeners = await hubService.listHubs();
    await Promise.all(
        listeners.map(l =>
            axios.post(l.callback, payload).catch(err => {
                console.error("Failed to notify listener", l.callback, err.message);
            })
        )
    );
}
