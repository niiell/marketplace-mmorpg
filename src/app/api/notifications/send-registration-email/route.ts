import { NextRequest, NextResponse } from 'next/server';

// Example email sending function (replace with actual email service integration)
async function sendRegistrationEmail(email: string, username: string) {
  try {
    // Implement email sending logic here, e.g., using SendGrid, Nodemailer, etc.
    console.log(`Sending registration email to ${email} for user ${username}`);
    return true;
  } catch (error: any) {
    // console.error(`Error sending registration email: ${error.message}`);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, username } = await request.json();

    if (!email || !username) {
      return NextResponse.json({ error: 'Missing email or username' }, { status: 400 });
    }

    if (!email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    if (username.length < 3) {
      return NextResponse.json({ error: 'Username must be at least 3 characters' }, { status: 400 });
    }

    const emailSent = await sendRegistrationEmail(email, username);

    if (!emailSent) {
      return NextResponse.json({ error: 'Failed to send registration email' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`Error handling POST request: ${error.message}`);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}