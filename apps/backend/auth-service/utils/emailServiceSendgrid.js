import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmailSendgrid(to, subject, html) {
    try {
        const msg = {
            to,
            from: process.env.EMAIL_USER,
            subject,
            html,
        };

        const response = await sgMail.send(msg);
        console.log('✅ SendGrid response:', response[0].statusCode);
        return { success: true, response };

    } catch (error) {
        console.error('❌ SendGrid error:', error);
        if (error.response) console.error(error.response.body);
        throw error;
    }
}
