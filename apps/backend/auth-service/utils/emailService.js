import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "markethubdev@gmail.com",     // HARD CODED
        pass: "jnafvptbgngfibdd"            // HARD CODED (App Password)
    }
});

export async function sendEmail(to, subject, html) {
    return transporter.sendMail({
        from: "markethubdev@gmail.com",
        to,
        subject,
        html
    });
}
