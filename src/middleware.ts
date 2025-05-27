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

    // Skip middleware for public paths
    if (pathname === '/login' || 
        pathname === '/register' || 
        pathname.startsWith('/_next') || 
        pathname.includes('.')) {
      return NextResponse.next();
    }

    // Set security headers with less restrictive CSP
    const securityHeaders = {
      'Content-Security-Policy': "default-src 'self' https://*.supabase.co; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://*.supabase.co; connect-src 'self' https://*.supabase.co https://*.xendit.co wss://*.supabase.co; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self';",
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
          error
        } = await supabase.auth.getSession();

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
    return NextResponse.next();
  }
}

/**
 * Configuration for the middleware.
 */
export const config = {
  matcher: ['/dashboard', '/listing/new', '/admin', '/marketplace', '/product/:path*', '/chat/:path*', '/'],
};