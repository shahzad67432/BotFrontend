// OTP storage type
type OTPRecord = {
  email: string;
  otp: string;
  expiresAt: Date;
};

// Temporary in-memory OTP storage (replace with Redis or database in production)
export const otpStorage: Record<string, OTPRecord> = {};

// Generate 6-digit OTP
function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function sendOTPEmail(email: string, otp: string) {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Your Authentication Code</h2>
      <p>Your OTP code is: <strong style="font-size: 24px; color: #4F46E5;">${otp}</strong></p>
      <p>This code will expire in 10 minutes.</p>
      <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: 'Your Authentication OTP',
    text: `Your OTP is: ${otp}. It will expire in 10 minutes.`,
    html: htmlContent
  });
}


import { sendEmail } from '@/lib/email-service';
import { NextApiRequest, NextApiResponse } from 'next';
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const email = req.body.email;
        const otp = generateOTP();
        otpStorage[email] = { email, otp, expiresAt: new Date(Date.now() + 5 * 60000) }; // 5 minutes expiry

        sendOTPEmail(email, otp).catch(console.error);

        res.status(200).json({ message: "OTP Email sent successfully", otp });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}