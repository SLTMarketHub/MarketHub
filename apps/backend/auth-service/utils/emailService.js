import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // your Gmail address
        pass: "geulqcrtmevjdzxt" || process.env.EMAIL_PASS // your Gmail App Password
    },
});

export async function sendEmail(to, subject, html) {
    console.log('Email User :', process.env.EMAIL_USER, 'Email Pass : ', process.env.EMAIL_PASS);
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html,
    };

    return transporter.sendMail(mailOptions);
}
