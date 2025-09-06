import * as hubService from "../services/hubService.js";

export const registerHub = async (req, res) => {
    try {
        const { callback, query } = req.body;
        if (!callback) {
            return res.status(400).json({ error: "callback is required" });
        }

        const hub = await hubService.registerHub(callback, query);
        res.status(201).json(hub);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const unregisterHub = async (req, res) => {
    try {
        const id = req.params.id;
        await hubService.unregisterHub(id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
