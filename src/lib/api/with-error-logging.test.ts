/**
 * @jest-environment node
 */

jest.mock('@/auth', () => ({ auth: jest.fn() }));
jest.mock('@/lib/rate-limit', () => ({ checkRateLimit: jest.fn() }));

import { withErrorLogging } from './with-error-logging';
import { auth } from '@/auth';
import { checkRateLimit } from '@/lib/rate-limit';

const mockedAuth = auth as jest.Mock;
const mockedCheckRateLimit = checkRateLimit as jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('withErrorLogging', () => {
  it('passes a signed-out request straight through with no rate-limit check', async () => {
    mockedAuth.mockResolvedValue(null);
    const handler = jest.fn(async () => new Response('ok', { status: 200 }));
    const wrapped = withErrorLogging('test-route', handler);

    const response = await wrapped();

    expect(response.status).toBe(200);
    expect(mockedCheckRateLimit).not.toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith(undefined);
  });

  it('passes the coachId through to the handler and allows the request when under the limit', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'coach-1' } });
    mockedCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 59 });
    const handler = jest.fn(async () => new Response('ok', { status: 200 }));
    const wrapped = withErrorLogging('test-route', handler);

    const response = await wrapped();

    expect(response.status).toBe(200);
    expect(response.headers.get('X-RateLimit-Remaining')).toBe('59');
    expect(handler).toHaveBeenCalledWith('coach-1');
  });

  it('returns 429 and never calls the handler when the limit is exceeded', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'coach-1' } });
    mockedCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });
    const handler = jest.fn(async () => new Response('ok', { status: 200 }));
    const wrapped = withErrorLogging('test-route', handler);

    const response = await wrapped();

    expect(response.status).toBe(429);
    expect(handler).not.toHaveBeenCalled();
  });

  it('catches a thrown error and returns a 500 with a safe message', async () => {
    mockedAuth.mockResolvedValue({ user: { id: 'coach-1' } });
    mockedCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 59 });
    const handler = async (): Promise<Response> => {
      throw new Error('something broke internally');
    };
    const wrapped = withErrorLogging('test-route', handler);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await wrapped();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe('Something went wrong. Please try again.');
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('includes the route name in the logged error', async () => {
    mockedAuth.mockResolvedValue(null);
    const handler = async (): Promise<Response> => {
      throw new Error('boom');
    };
    const wrapped = withErrorLogging('POST /api/matches', handler);
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await wrapped();

    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining('POST /api/matches'),
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
