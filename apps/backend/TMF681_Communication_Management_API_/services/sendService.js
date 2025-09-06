import CommunicationMessage from "../models/CommunicationMessage.js";
import { publishEvent } from "./notificationService.js";
import { sendViaProvider } from "./providerAdapters.js";

const enqueueSend = async (message) => {
    const when = message.scheduledSendTime ? new Date(message.scheduledSendTime) : new Date();
    if (when <= new Date()) {
        send(message).catch(() => { });
    } else {
        const delay = when.getTime() - Date.now();
        setTimeout(() => send(message).catch(() => { }), delay);
    }
};

const send = async (message) => {
    const msg = await CommunicationMessage.findOne({ id: message.id });
    if (!msg) return;

    msg.state = "inProgress";
    msg.sendTime = new Date();
    await msg.save();
    publishEvent("CommunicationMessageStateChangeEvent", { communicationMessage: msg }).catch(() => { });

    const attempts = msg.tryTimes || 3;
    let lastError = null;

    for (let attempt = 1; attempt <= attempts; attempt++) {
        try {
            await sendViaProvider(msg);
            msg.state = "completed";
            msg.sendTimeComplete = new Date();
            await msg.save();
            publishEvent("CommunicationMessageStateChangeEvent", { communicationMessage: msg }).catch(() => { });
            return;
        } catch (err) {
            lastError = err;
            const backoff = attempt * 1000;
            await new Promise(r => setTimeout(r, backoff));
        }
    }

    msg.state = "failed";
    await msg.save();
    publishEvent("CommunicationMessageStateChangeEvent", {
        communicationMessage: msg,
        error: (lastError && lastError.message) || "unknown"
    }).catch(() => { });
};

export default { enqueueSend, send };
