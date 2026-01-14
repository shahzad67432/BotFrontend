import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/neo4j';
import { create_token } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, otp, name, password, SignType } = req.body;

  // Verify OTP in Neo4j
  const user = await db.verifyOTP({
    email,
    otp
  });

  if (!user) {
    return res.status(400).json({
      message: 'Invalid or expired OTP'
    });
  }

  if (SignType === 'signup') {
    // Update existing user with password (user was created during storeOTP)
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password required' });
    }

    const newUser = await db.createOrUpdateUserWithPassword(email, name, password);
    const token = create_token({ email: newUser.email, userId: newUser.id });
    
    return res.status(200).json({
      message: 'User created successfully',
      token
    });
  }

  if (SignType === 'login') {
    const token = create_token({ email: user.email, userId: user.id });
    return res.status(200).json({
      message: 'Login successful',
      token
    });
  }

  return res.status(400).json({ message: 'Invalid SignType' });
}