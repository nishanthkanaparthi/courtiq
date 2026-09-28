import { auth } from '@/auth';

export const proxy = auth((req) => {
  if (!req.auth) {
    const signInUrl = new URL('/signin', req.nextUrl.origin);
    return Response.redirect(signInUrl);
  }
});

export const config = {
  matcher: ['/dashboard', '/match/live', '/history', '/history/:path*', '/analytics'],
};