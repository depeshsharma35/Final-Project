import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure environment variables are loaded regardless of execution working directory
dotenv.config({ path: path.resolve(__dirname, '../../.env'), override: true });
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });
dotenv.config({ override: true });

/**
 * Helper to get or create the Gmail SMTP transporter
 */
function getTransporter() {
  const cleanPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: cleanPass
    }
  });
}

/**
 * Requirement 9: Verify that the SMTP configuration works before sending emails.
 * Can also be called at server startup to check SMTP connectivity.
 * @returns {Promise<boolean>} True if SMTP connection and authentication succeed, false otherwise
 */
export async function verifySMTP() {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your-email@gmail.com') {
      console.warn('⚠️ Gmail SMTP Credentials (EMAIL_USER and EMAIL_PASS) are missing or set to placeholder values in .env.');
      console.warn('⚠️ Email OTP delivery will fail until valid Gmail credentials and an App Password are configured.');
      return false;
    }

    const transporter = getTransporter();
    await transporter.verify();
    console.log('✉️ Gmail SMTP Server connection & authentication verified successfully!');
    return true;
  } catch (error) {
    console.error('❌ Gmail SMTP configuration verification failed:', error.message);
    return false;
  }
}

/**
 * Reusable utility to send an OTP verification email to the user
 * @param {string} toEmail - Recipient email address
 * @param {string} otpCode - 6-digit OTP code
 * @param {string} [userName='User'] - Recipient name for greeting
 * @returns {Promise<object>} Nodemailer sent message info
 */
export async function sendOTP(toEmail, otpCode, userName = 'User') {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || process.env.EMAIL_USER === 'your-email@gmail.com') {
    throw new Error('SMTP credentials (EMAIL_USER and EMAIL_PASS) are not configured or still set to default placeholders in .env.');
  }

  const transporter = getTransporter();

  // Requirement 9: Verify that the SMTP configuration works before sending emails
  await transporter.verify();

  const mailOptions = {
    from: `"StreamVault Security" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Email Verification OTP',
    text: `Hello ${userName},\n\nYour email verification code is: ${otpCode}\n\nNote: This OTP expires in 5 minutes.\n\nIf you did not request this code, please ignore this email.\n\nBest regards,\nStreamVault Team`,
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f172a; color: #f8fafc; border-radius: 12px; border: 1px solid #334155;">
        <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #1e293b;">
          <h1 style="color: #38bdf8; margin: 0; font-size: 24px; font-weight: 700; letter-spacing: 1px;">StreamVault</h1>
        </div>
        <div style="padding: 30px 20px; text-align: center;">
          <h2 style="color: #f8fafc; font-size: 20px; margin-bottom: 12px;">Hello, ${userName}!</h2>
          <p style="color: #94a3b8; font-size: 15px; margin-bottom: 25px; line-height: 1.6;">
            Thank you for registering with StreamVault. Please use the verification code below to verify your email address:
          </p>
          <div style="background-color: #1e293b; border: 2px dashed #38bdf8; border-radius: 10px; padding: 18px 36px; display: inline-block; margin-bottom: 25px;">
            <span style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #38bdf8;">${otpCode}</span>
          </div>
          <p style="color: #f43f5e; font-size: 14px; font-weight: 600; margin-bottom: 20px;">
            ⚠️ Note: This OTP expires in 5 minutes.
          </p>
          <p style="color: #64748b; font-size: 13px; margin: 0; line-height: 1.5;">
            If you did not request this verification code, please ignore this email or contact our support team immediately.
          </p>
        </div>
        <div style="text-align: center; padding-top: 20px; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
          <p style="margin: 0;">&copy; ${new Date().getFullYear()} StreamVault. All rights reserved.</p>
        </div>
      </div>
    `
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`📧 OTP email sent successfully to ${toEmail} (Message ID: ${info.messageId})`);
  return info;
}
