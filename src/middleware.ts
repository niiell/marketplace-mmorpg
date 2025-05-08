import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

const protectedPaths = ['/dashboard', '/listing/new', '/admin'];

/**
 * Middleware function to handle authentication and security headers.
 * 
 * @param {NextRequest} req - The incoming request.
 * @returns {Promise<NextResponse>} The response to be sent back to the client.
 */
export async function middleware(req: NextRequest) {
  try {
    const { pathname } = req.nextUrl;

    // Set security headers (Helmet.js equivalent)
    const securityHeaders = {
      'Content-Security-Policy': "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self' https://*.supabase.co https://*.xendit.co; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
      'X-DNS-Prefetch-Control': 'off',
      'X-Frame-Options': 'DENY',
      'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
      'X-XSS-Protection': '1; mode=block',
    };

    // Check if the path needs protection
    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      try {
        const res = NextResponse.next();

        // Add security headers to response
        Object.entries(securityHeaders).forEach(([key, value]) => {
          res.headers.set(key, value);
        });

        const supabase = createMiddlewareClient({ req, res });
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          const loginUrl = new URL('/login', req.url);
          loginUrl.searchParams.set('redirectedFrom', pathname);
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
        console.error('Middleware auth error:', error);
        return NextResponse.redirect(new URL('/login', req.url));
      }
    }

    // For other paths, still add security headers
    const res = NextResponse.next();
    Object.entries(securityHeaders).forEach(([key, value]) => {
      res.headers.set(key, value);
    });
    return res;
  } catch (error) {
    console.error('Middleware error:', error);
    // Always return a valid response, never throw
    return NextResponse.next();
  }
}

/**
 * Configuration for the middleware.
 */
export const config = {
  matcher: ['/dashboard', '/listing/new', '/admin', '/marketplace', '/product/:path*', '/chat/:path*', '/'],
};