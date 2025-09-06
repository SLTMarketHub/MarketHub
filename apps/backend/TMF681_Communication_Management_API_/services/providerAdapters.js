import twilio from "twilio";
import sgMail from "@sendgrid/mail";


export async function sendViaProvider(msg) {
    if (msg.messageType === "SMS") {
        const phone = (msg.receiver && msg.receiver[0] && msg.receiver[0].phoneNumber) || null;
        if (!phone) throw new Error("No phone number on receiver");
        const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
        await client.messages.create({ body: msg.content, from: process.env.TWILIO_FROM, to: phone });
        return;
    }


    if (msg.messageType === "Email") {
        const email = (msg.receiver && msg.receiver[0] && msg.receiver[0].email) || null;
        if (!email) throw new Error("No email on receiver");
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const mail = { to: email, from: process.env.SENDGRID_FROM, subject: msg.subject || "Notification", text: msg.content };
        await sgMail.send(mail);
        return;
    }


    if (msg.messageType === "Push") {
        // Implement your push provider (FCM/APNS) here
        // For now, throw to indicate not implemented
        throw new Error("Push provider not implemented");
    }


    throw new Error("Unsupported messageType");
}