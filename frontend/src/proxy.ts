import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignore static files and API routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname.includes('.')) {
    return NextResponse.next();
  }

  // Extract clean pathname without locale for public page check
  const locales = routing.locales;
  let cleanPathname = pathname;
  for (const loc of locales) {
    if (cleanPathname.startsWith(`/${loc}/`) || cleanPathname === `/${loc}`) {
      cleanPathname = cleanPathname.substring(loc.length + 1) || '/';
      break;
    }
  }

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  const isPublicPage =
    cleanPathname === '/' ||
    cleanPathname === '/login' ||
    cleanPathname === '/register' ||
    cleanPathname.startsWith('/register/') ||
    cleanPathname === '/forgot-password' ||
    cleanPathname === '/reset-password' ||
    cleanPathname === '/verify' ||
    cleanPathname === '/terms' ||
    cleanPathname === '/privacy-policy';

  // Determine current locale (fallback to default)
  let locale = routing.defaultLocale;
  for (const loc of locales) {
    if (pathname.startsWith(`/${loc}/`) || pathname === `/${loc}`) {
      locale = loc;
      break;
    }
  }

  // We run next-intl middleware first to handle standard URL localization
  let response = intlMiddleware(request);

  if (!isPublicPage && !accessToken && !refreshToken) {
    const loginUrl = new URL(`/${locale}/`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // If on home page and have refresh token, try to validate/refresh and redirect to arena
  if (cleanPathname === '/' && refreshToken) {
    let isExpired = true;
    if (accessToken) {
      const decoded = parseJwt(accessToken);
      if (decoded && decoded.exp) {
        isExpired = decoded.exp * 1000 < Date.now() + 10000;
      }
    }

    if (!isExpired) {
      return NextResponse.redirect(new URL(`/${locale}/arena`, request.url));
    }

    // If expired, try to refresh
    try {
      const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
        method: 'POST',
        headers: {
          Cookie: `refresh_token=${refreshToken}`,
        },
      });

      if (refreshRes.ok) {
        const setCookieHeader = refreshRes.headers.get('set-cookie');
        response = NextResponse.redirect(new URL(`/${locale}/arena`, request.url));
        if (setCookieHeader) {
          response.headers.set('Set-Cookie', setCookieHeader);
        }
        return response;
      }
    } catch {
      // If refresh fails on home page, just continue to show login
      return response;
    }
  }

  if (!isPublicPage && refreshToken) {
    let isExpired = true;
    if (accessToken) {
      const decoded = parseJwt(accessToken);
      if (decoded && decoded.exp) {
        // Check if token is expired, adding a 10 second buffer
        isExpired = decoded.exp * 1000 < Date.now() + 10000;
      }
    }

    if (isExpired) {
      try {
        const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: {
            Cookie: `refresh_token=${refreshToken}`,
          },
        });

        if (refreshRes.ok) {
          const setCookieHeader = refreshRes.headers.get('set-cookie');
          if (setCookieHeader) {
            response.headers.set('Set-Cookie', setCookieHeader);

            const newCookies = setCookieHeader.split(',').reduce(
              (acc, cookieStr) => {
                const [, name, value] = cookieStr.match(/([^=]+)=([^;]+)/) || [];
                if (name && value) {
                  acc[name.trim()] = value.trim();
                }
                return acc;
              },
              {} as Record<string, string>,
            );

            if (newCookies['access_token']) {
              request.cookies.set('access_token', newCookies['access_token']);
              
              const newHeaders = new Headers(request.headers);
              newHeaders.set('Cookie', request.headers.get('Cookie') || '');
              
              // Also update response from intlMiddleware with header
              response.headers.set('Set-Cookie', setCookieHeader);
            }
          }
        } else if (!isPublicPage) {
          // Refresh failed (e.g., refresh token also expired), redirect to login
          const loginUrl = new URL(`/${locale}/`, request.url);
          return NextResponse.redirect(loginUrl);
        }
      } catch {
        if (!isPublicPage) {
          const loginUrl = new URL(`/${locale}/`, request.url);
          return NextResponse.redirect(loginUrl);
        }
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!api|_next/static|_next/image|favicon.ico|manifest.json|OneSignalSDKWorker.js|OneSignalSDK.sw.js).*)',
  ],
};
