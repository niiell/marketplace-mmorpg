import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_ROUTES = [
  '/login',
  '/register',
  '/reset-password',
  '/',
  '/marketplace',
  '/product',
];

const isPublicRoute = (path: string) => {
  return PUBLIC_ROUTES.some(route => path.startsWith(route));
};

/**
 * Middleware function to handle authentication and security headers.
 * 
 * @param {NextRequest} req - The incoming request.
 * @returns {Promise<NextResponse>} The response to be sent back to the client.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  const pathname = req.nextUrl.pathname;

  // Skip auth check for public routes
  if (isPublicRoute(pathname)) {
    return res;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error) {
      console.error('Session error:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }

    if (!session) {
      const loginUrl = new URL('/login', req.url);
      // Only add redirectedFrom if it's not already going to /login
      if (pathname !== '/login') {
        loginUrl.searchParams.set('redirectedFrom', pathname);
      }
      return NextResponse.redirect(loginUrl);
    }

    // Role-based: only admin can access /admin
    if (pathname.startsWith('/admin')) {
      const role = session.user.app_metadata?.role;
      if (role !== 'admin' && role !== 'superadmin') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }

    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

/**
 * Configuration for the middleware.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};