import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

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

const locales = ['en', 'id', 'ph', 'th'];
const defaultLocale = 'id';

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

function getLocale(request: NextRequest): string {
  const headers = new Headers(request.headers);
  const acceptLanguage = headers.get('accept-language');
  
  if (acceptLanguage) {
    headers.set('accept-language', acceptLanguage.replaceAll('_', '-'));
  }

  const headersObject = Object.fromEntries(headers.entries());
  const languages = new Negotiator({ headers: headersObject }).languages();
  
  return match(languages, locales, defaultLocale);
}

/**
 * Middleware function to handle automatic language detection and routing.
 * 
 * @param {NextRequest} request - The incoming request.
 * @returns {Promise<NextResponse>} The response to be sent back to the client.
 */
export function languageMiddleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    
    return NextResponse.redirect(newUrl);
  }
}

/**
 * Configuration for the middleware.
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'
  ],
};