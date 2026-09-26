import { auth } from '@/auth';

export const proxy = auth((req) => {
  console.log('[proxy]', req.nextUrl.pathname, '— authenticated:', !!req.auth);
  if (!req.auth) {
    const signInUrl = new URL('/api/auth/signin', req.nextUrl.origin);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};