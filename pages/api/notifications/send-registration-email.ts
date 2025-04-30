import type { NextApiRequest, NextApiResponse } from 'next';

// Example email sending function (replace with actual email service integration)
async function sendRegistrationEmail(email: string, username: string) {
  // Implement email sending logic here, e.g., using SendGrid, Nodemailer, etc.
  console.log(`Sending registration email to ${email} for user ${username}`);
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, username } = req.body;
  if (!email || !username) {
    return res.status(400).json({ error: 'Missing email or username' });
  }

  try {
    await sendRegistrationEmail(email, username);
    return res.status(200).json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
