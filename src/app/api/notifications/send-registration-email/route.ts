import { NextRequest, NextResponse } from 'next/server';

// Example email sending function (replace with actual email service integration)
async function sendRegistrationEmail(email: string, username: string) {
  // Implement email sending logic here, e.g., using SendGrid, Nodemailer, etc.
  console.log(`Sending registration email to ${email} for user ${username}`);
  return true;
}

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json({ error: 'Missing email or username' }, { status: 400 });
    }

    await sendRegistrationEmail(email, username);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
