import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Temporary OTP memory store
const otpStore = new Map();

const RESEND_API_KEY = process.env.RESEND_API_KEY || '';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'otp@vibestore.bond';
const resend = new Resend(RESEND_API_KEY);

// Nodemailer SMTP Transporter setup (if EMAIL_USER and EMAIL_PASS are set in .env)
const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;
const isNodemailerConfigured = EMAIL_USER && EMAIL_PASS && EMAIL_PASS !== 'your_16_character_app_password_here';

let smtpTransporter = null;
if (isNodemailerConfigured) {
  smtpTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });
}

// API 1: Send OTP to Email
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email address is required' });
  }

  // Generate 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 Minutes Expiration

  // Save OTP against recipient email
  otpStore.set(email, { otp, expiresAt });

  console.log(`[OTP Generated] Email: ${email} | Code: ${otp}`);

  // Option 1: Try Nodemailer (Gmail SMTP) if configured
  if (smtpTransporter) {
    try {
      const info = await smtpTransporter.sendMail({
        from: `"Vibe Store" <${EMAIL_USER}>`,
        to: email,
        subject: '🔑 Your Vibe Store Verification Code',
        html: `
          <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px; max-width: 500px; margin: 0 auto;">
            <h2 style="color: #6366f1; margin-top: 0;">VIBE STORE VERIFICATION</h2>
            <p style="color: #cbd5e1; font-size: 14px;">Your One-Time Password (OTP) for authentication is:</p>
            <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; background-color: #1e293b; padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
              ${otp}
            </div>
            <p style="color: #94a3b8; font-size: 12px;">Valid for 5 minutes. Do not share with anyone.</p>
          </div>
        `,
      });
      console.log('Nodemailer Gmail sent successfully:', info.messageId);
      return res.json({
        success: true,
        message: `OTP code sent to ${email}. Please check your email inbox!`,
      });
    } catch (smtpError) {
      console.error('Nodemailer Error:', smtpError.message);
    }
  }

  // Option 2: Try Resend API
  try {
    const response = await resend.emails.send({
      from: `Vibe Store <${SENDER_EMAIL}>`,
      to: [email],
      subject: '🔑 Your Vibe Store Login Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #0f172a; color: #ffffff; border-radius: 16px; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #6366f1; margin-top: 0;">VIBE STORE VERIFICATION</h2>
          <p style="color: #cbd5e1; font-size: 14px;">Welcome to Vibe Store! Your One-Time Password (OTP) for authentication is:</p>
          <div style="font-size: 36px; font-weight: 800; letter-spacing: 8px; color: #38bdf8; background-color: #1e293b; padding: 16px; border-radius: 12px; text-align: center; margin: 24px 0; border: 1px solid #334155;">
            ${otp}
          </div>
          <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
            This OTP code is valid for 5 minutes. Please do not share this security code with anyone.
          </p>
          <hr style="border: none; border-top: 1px solid #334155; margin: 20px 0;" />
          <p style="color: #64748b; font-size: 11px; text-align: center;">Sent by Vibe Store • ${SENDER_EMAIL}</p>
        </div>
      `,
    });

    if (response.error) {
      throw new Error(response.error.message);
    }

    console.log('Resend email sent successfully:', response.data?.id);
    return res.json({
      success: true,
      message: `OTP code sent to ${email}. Please check your email inbox!`,
    });
  } catch (error) {
    console.error('Resend Error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP email. Please try again.',
      error: error.message,
    });
  }
});

// API 2: Verify OTP Code
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  const storedData = otpStore.get(email);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No active OTP found. Please request a new OTP code.' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ success: false, message: 'OTP has expired! Please request a new code.' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Incorrect OTP code! Please check and try again.' });
  }

  // OTP Verified! Clear memory
  otpStore.delete(email);
  res.json({ success: true, message: 'OTP verified successfully! Welcome to Vibe Store.' });
});

// Basic root route for browser access
app.get('/', (req, res) => {
  res.send(`<!doctype html><html><head><title>Vibe Store API</title></head><body><h1>Vibe Store API</h1><p>Use <code>POST /api/send-otp</code> to send an email OTP.</p></body></html>`);
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`⚡ Vibe Store OTP Node Server Live on http://localhost:${PORT}`);
    console.log(`📧 Sender Email: ${SENDER_EMAIL}`);
    console.log(`====================================================`);
  });
}

export default app;
