require('dotenv').config();
const sgMail = require('@sendgrid/mail');

// Set SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, text) => {
    try {
        await sgMail.send({
            to,                                      // recipient
            from: 'Schedulo <sayamprogrammingworld@gmail.com>', // verified sender
            subject,                                 // email subject
            text,                                    // plain text body
            html: `<p>${text}</p>`,                  // optional HTML body
        });

        console.log(`✅ Email sent to ${to}`);
    } catch (error) {
        console.error('❌ Error sending email:', error.response?.body || error);
        throw new Error('Email not sent');
    }
};

module.exports = sendEmail;
