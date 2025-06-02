import { NextRequest, NextResponse } from 'next/server';
import { randomBytes } from 'crypto';

const CSRF_COOKIE_NAME = 'csrf-token';
const CSRF_HEADER_NAME = 'x-csrf-token';

export function generateCsrfToken() {
  return randomBytes(32).toString('hex');
}

export async function csrfMiddleware(req: NextRequest) {
  const csrfToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;

  if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
    // For safe methods, set CSRF cookie if not present
    if (!csrfToken) {
      const newToken = generateCsrfToken();
      const res = NextResponse.next();
      res.cookies.set(CSRF_COOKIE_NAME, newToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      });
      return res;
    }
    return NextResponse.next();
  }

  // For unsafe methods, validate CSRF token
  const requestToken = req.headers.get(CSRF_HEADER_NAME);
  if (!csrfToken || !requestToken || csrfToken !== requestToken) {
    return new NextResponse('Invalid CSRF token', { status: 403 });
  }

  return NextResponse.next();
}
