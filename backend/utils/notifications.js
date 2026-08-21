import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

let transporter = null;

const setupTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    try {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
      console.log('📬 SMTP Transporter configured.');
    } catch (err) {
      console.error('Failed to configure SMTP:', err.message);
    }
  } else {
    console.log('⚠️ SMTP host, user, or password missing in env. Email sending will fall back to terminal logs.');
  }
};

setupTransporter();

export const sendEmailNotification = async ({ to, subject, text, html }) => {
  const mailOptions = {
    from: process.env.MAIL_FROM || 'Fitness World <noreply@fitnessworld.lk>',
    to,
    subject,
    text,
    html: html || text.replace(/\n/g, '<br>')
  };

  if (!transporter) {
    logEmailToConsole(mailOptions);
    return { success: true, logged: true };
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✉️ Email sent successfully: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email sending failed. Logging to console instead:', error.message || error);
    logEmailToConsole(mailOptions);
    return { success: false, error: error.message };
  }
};

const logEmailToConsole = (options) => {
  console.log('\n==================================================');
  console.log('✉️  [EMAIL NOTIFICATION LOG - STAGE/DEV FALLBACK]');
  console.log(`From:    ${options.from}`);
  console.log(`To:      ${options.to}`);
  console.log(`Subject: ${options.subject}`);
  console.log('--------------------------------------------------');
  console.log(options.text);
  console.log('==================================================\n');
};
