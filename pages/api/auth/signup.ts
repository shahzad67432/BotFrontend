
import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/neo4j';

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, name, password, SignType } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Valid email required' });
  }

  // For signup, require name and password
  if (SignType === 'signup') {
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password required for signup' });
    }
  }

  // Check if user exists
  const existingUser = await db.findUserByEmail(email);
  
  if (SignType === 'login' && !existingUser) {
    return res.json({ message: 'User not found' });
  }

  if (SignType === 'signup' && existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // Store OTP in Neo4j
  await db.storeOTP({
    email,
    otp,
    expiresAt
  });

  // 🔥 EMAIL SENDING COMMENTED OUT - RETURN OTP IN RESPONSE
  // await sendOTPEmail(email, otp).catch((error) => {
  //   console.error('Error sending OTP email:', error);
  //   return res.status(500).json({ message: 'Error sending OTP email' });
  // });

  // For development: Return OTP directly
  return res.status(200).json({ 
    message: 'OTP generated successfully',
    otp: otp, // 🔥 OTP shown on screen for now
    expiresAt: expiresAt
  });
}

// 🔥 COMMENTED OUT - Email sending logic
// async function sendOTPEmail(email: string, otp: string) {
//   const htmlContent = `
//     <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
//       <h2 style="color: #333;">Your Authentication Code</h2>
//       <p>Your OTP code is: <strong style="font-size: 24px; color: #4F46E5;">${otp}</strong></p>
//       <p>This code will expire in 5 minutes.</p>
//       <p style="color: #666; font-size: 14px;">If you didn't request this code, please ignore this email.</p>
//     </div>
//   `;

//   await sendEmail({
//     to: email,
//     subject: 'Your Authentication OTP',
//     text: `Your OTP is: ${otp}. It will expire in 5 minutes.`,
//     html: htmlContent
//   });
// }