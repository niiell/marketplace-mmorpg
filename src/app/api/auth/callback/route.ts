import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../src/lib/supabase';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const { searchParams } = url;
  const provider = searchParams.get('provider');
  const code = searchParams.get('code');

  if (!provider || !code) {
    return NextResponse.json({ error: 'Missing provider or code' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    const user = data.user;
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    // Set user session
    const session = data.session;
    if (!session) {
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 });
    }
    // Redirect to dashboard after successful auth
    return NextResponse.redirect(new URL('/dashboard', url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}