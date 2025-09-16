import Hub from "../models/hubModel.js";

export async function registerHub(callback, query) {
    const hub = new Hub({ callback, query });
    return hub.save();
}

export async function unregisterHub(id) {
    return Hub.deleteOne({ _id: id });
}

export async function listHubs() {
    return Hub.find();
}
