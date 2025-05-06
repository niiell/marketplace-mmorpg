import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../../../../src/lib/supabase';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
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
    // Redirect to dashboard after successful auth
    return NextResponse.redirect(new URL('/dashboard', request.url));
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
