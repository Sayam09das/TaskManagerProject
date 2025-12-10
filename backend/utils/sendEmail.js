require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
    try {
        // Remove all HTML tags to create a clean plain-text fallback
        const plainText = html.replace(/<[^>]+>/g, '');

        await sgMail.send({
            to,
            from: {
                name: 'Schedulo',
                email: process.env.SENDGRID_FROM_EMAIL || 'sayamprogrammingworld@gmail.com'
            },
            subject,
            html,
            text: plainText,
        });

        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending email:', error.response?.body || error);
        throw new Error('Email not sent');
    }
};

module.exports = sendEmail;
