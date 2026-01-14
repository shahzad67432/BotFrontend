import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/neo4j';
import { create_token } from '@/lib/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  // Verify password
  const user = await db.verifyPassword(email, password);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const token = create_token({ email: user.email, userId: user.id });

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      email: user.email,
      name: user.name,
      credits: user.credits
    }
  });
}