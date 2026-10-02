import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { checkRateLimit } from '@/lib/rate-limit';

type InnerHandler<Args extends unknown[]> = (
  coachId: string | undefined,
  ...args: Args
) => Promise<Response>;

export function withErrorLogging<Args extends unknown[]>(
  routeName: string,
  handler: InnerHandler<Args>
) {
  return async (...args: Args) => {
    try {
      const session = await auth();
      const coachId = session?.user?.id;

      if (coachId) {
        const { allowed, remaining } = await checkRateLimit(coachId);
        if (!allowed) {
          return NextResponse.json(
            { error: 'Too many requests. Please slow down.' },
            { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
          );
        }
        const response = await handler(coachId, ...args);
        response.headers.set('X-RateLimit-Remaining', String(remaining));
        return response;
      }

      return await handler(coachId, ...args);
    } catch (error) {
      console.error(`[${routeName}] Unhandled error:`, error);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
  };
}
