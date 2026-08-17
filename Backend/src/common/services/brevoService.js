const { transactionalEmailApi, SibApiV3Sdk } = require('../../config/brevo');

/**
 * Send a transactional email via Brevo.
 * Fails silently (logs only) so it never blocks the core approval/auth flow.
 */
const sendEmail = async ({ to, subject, htmlContent }) => {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY not set - skipping email send:', subject);
    return;
  }

  try {
    const email = new SibApiV3Sdk.SendSmtpEmail();
    email.subject = subject;
    email.htmlContent = htmlContent;
    email.sender = {
      email: process.env.BREVO_SENDER_EMAIL,
      name: process.env.BREVO_SENDER_NAME,
    };
    email.to = [{ email: to }];

    await transactionalEmailApi.sendTransacEmail(email);
  } catch (err) {
    console.error('Brevo email error:', err.message);
  }
};

module.exports = { sendEmail };