import CommunicationMessage from "../models/CommunicationMessage.js";

export async function createMessage(data) {
    const msg = new CommunicationMessage(data);
    return msg.save();
}

export async function getMessageById(id) {
    return CommunicationMessage.findOne({ id });
}

export async function listMessages(filter = {}, limit = 100) {
    return CommunicationMessage.find(filter).limit(limit);
}

export async function updateMessage(id, patch) {
    const msg = await CommunicationMessage.findOne({ id });
    if (!msg) return null;
    Object.assign(msg, patch);
    await msg.save();
    return msg;
}

export async function deleteMessage(id) {
    return CommunicationMessage.deleteOne({ id });
}
