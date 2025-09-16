import cron from "node-cron";
import CommunicationMessage from "../models/CommunicationMessage.js";
import sendService from "./sendService.js";

export const startScheduler = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const due = await CommunicationMessage.find({
                state: { $in: ["initial", "inProgress"] },
                scheduledSendTime: { $lte: now }
            }).limit(100);

            for (const msg of due) {
                sendService.enqueueSend(msg).catch(() => { });
            }
        } catch (err) {
            console.error("Scheduler error:", err.message);
        }
    });
};
