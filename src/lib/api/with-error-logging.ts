import { NextResponse } from 'next/server';

type RouteHandler = (...args: never[]) => Promise<Response>;

export function withErrorLogging<T extends RouteHandler>(routeName: string, handler: T): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error(`[${routeName}] Unhandled error:`, error);
      return NextResponse.json(
        { error: 'Something went wrong. Please try again.' },
        { status: 500 }
      );
    }
  }) as T;
}
