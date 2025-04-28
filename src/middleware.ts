import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const protectedPaths = ['/dashboard', '/listing/new', '/admin'];

export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;
    
    // Cek apakah path perlu proteksi
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      try {
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
            return NextResponse.redirect(new URL('/dashboard', req.url));
          }
        }
      } catch (error) {
        console.error('Middleware auth error:', error);
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }
    
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    // Always return a valid response, never throw
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard', '/listing/new', '/admin'],
};
