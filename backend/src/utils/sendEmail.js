const nodemailer = require('nodemailer');

/**
 * Sends an email using configured SMTP credentials or logs to console as a fallback.
 * 
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plaintext body
 * @param {string} [options.html] - HTML body
 * @returns {Promise<boolean>} True if successful or mocked, false otherwise.
 */
const sendEmail = async (options) => {
    try {
        const hasSmtpConfig = process.env.SMTP_HOST && process.env.SMTP_USER;

        if (!hasSmtpConfig) {
            console.log('\n[Development Mailer] SMTP credentials not configured. Email bypassed.');
            console.log('--- EMAIL MOCK ---');
            console.log(`To: ${options.to}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Body:\n${options.text}`);
            console.log('------------------\n');
            return true;
        }

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT || 587,
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const message = {
            from: process.env.SMTP_FROM || `${process.env.SMTP_USER}`,
            to: options.to,
            subject: options.subject,
            text: options.text,
            html: options.html
        };

        const info = await transporter.sendMail(message);
        console.log(`Message sent: ${info.messageId}`);
        return true;
    } catch (err) {
        console.error('Email sending failed:', err.message);
        return false;
    }
};

module.exports = sendEmail;
