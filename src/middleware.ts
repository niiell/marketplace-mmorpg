import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

// Daftar path yang harus login
const protectedPaths = ['/dashboard', '/listing/new', '/admin'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // Cek apakah path perlu proteksi
  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Role-based: hanya admin bisa akses /admin
    if (pathname.startsWith('/admin')) {
      const role = session.user.app_metadata?.role;
      if (role !== 'admin' && role !== 'superadmin') {
        // Redirect user non-admin ke dashboard
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard', '/listing/new', '/admin'],
};
