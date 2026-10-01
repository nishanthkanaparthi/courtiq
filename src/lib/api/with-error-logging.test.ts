/**
 * @jest-environment node
 */

import { withErrorLogging } from './with-error-logging';

describe('withErrorLogging', () => {
  it("returns the handler's response unchanged when it succeeds", async () => {
    const handler = async () => new Response('ok', { status: 200 });
    const wrapped = withErrorLogging('test-route', handler);

    const response = await wrapped();

    expect(response.status).toBe(200);
  });

  it('catches a thrown error and returns a 500 with a safe message', async () => {
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
