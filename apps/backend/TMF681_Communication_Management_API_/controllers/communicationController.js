import * as communicationService from "../services/communicationService.js";
import sendService from "../services/sendService.js";
import { publishEvent } from "../services/notificationService.js";
import { canTransition } from "../services/stateMachineService.js";

export const listMessages = async (req, res) => {
    try {
        const { messageType, state, limit = 100 } = req.query;
        const filter = {};
        if (messageType) filter.messageType = messageType;
        if (state) filter.state = state;
        const messages = await communicationService.listMessages(filter, Number(limit));
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getMessage = async (req, res) => {
    try {
        const msg = await communicationService.getMessageById(req.params.id);
        if (!msg) return res.status(404).send();
        res.json(msg);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createMessage = async (req, res) => {
    try {
        const { content, sender, receiver, messageType } = req.body;
        if (!content || !sender || !receiver || !messageType) {
            return res.status(400).json({ error: "content, sender, receiver and messageType are required" });
        }
        const message = await communicationService.createMessage(req.body);

        publishEvent("CommunicationMessageAttributeValueChangeEvent", { communicationMessage: message }).catch(() => { });

        if (message.state === "inProgress") {
            sendService.enqueueSend(message);
        }

        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const patchMessage = async (req, res) => {
    try {
        const msg = await communicationService.getMessageById(req.params.id);
        if (!msg) return res.status(404).send();

        if (req.body.state && !canTransition(msg.state, req.body.state)) {
            return res.status(400).json({ error: `Invalid state transition from ${msg.state} to ${req.body.state}` });
        }

        const updated = await communicationService.updateMessage(req.params.id, req.body);
        publishEvent("CommunicationMessageAttributeValueChangeEvent", { communicationMessage: updated }).catch(() => { });

        if (req.body.state === "inProgress") sendService.enqueueSend(updated);

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        await communicationService.deleteMessage(req.params.id);
        publishEvent("CommunicationMessageStateChangeEvent", { communicationMessage: { id: req.params.id, state: "deleted" } }).catch(() => { });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const sendMessageNow = async (req, res) => {
    try {
        const msg = await communicationService.getMessageById(req.params.id);
        if (!msg) return res.status(404).send();
        sendService.send(msg).catch(() => { });
        res.status(202).json({ status: "send triggered" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
