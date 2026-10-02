/**
 * @jest-environment node
 */

jest.mock('@/lib/db/prisma-client', () => ({
  prisma: {
    rateLimit: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
  },
}));

import { checkRateLimit } from './rate-limit';
import { prisma } from '@/lib/db/prisma-client';

const mockedPrisma = prisma as unknown as {
  rateLimit: {
    findUnique: jest.Mock;
    upsert: jest.Mock;
    update: jest.Mock;
  };
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('checkRateLimit', () => {
  it('allows the first request from a coach with no prior row', async () => {
    mockedPrisma.rateLimit.findUnique.mockResolvedValue(null);

    const result = await checkRateLimit('coach-1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
    expect(mockedPrisma.rateLimit.upsert).toHaveBeenCalled();
  });

  it('allows a request within the window and under the limit', async () => {
    mockedPrisma.rateLimit.findUnique.mockResolvedValue({
      coachId: 'coach-1',
      count: 10,
      windowStart: new Date(),
    });

    const result = await checkRateLimit('coach-1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(49);
    expect(mockedPrisma.rateLimit.update).toHaveBeenCalledWith({
      where: { coachId: 'coach-1' },
      data: { count: { increment: 1 } },
    });
  });

  it('denies a request at the limit within the window', async () => {
    mockedPrisma.rateLimit.findUnique.mockResolvedValue({
      coachId: 'coach-1',
      count: 60,
      windowStart: new Date(),
    });

    const result = await checkRateLimit('coach-1');

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
    expect(mockedPrisma.rateLimit.update).not.toHaveBeenCalled();
  });

  it('resets the window once it has expired, even if the prior count was at the limit', async () => {
    const expiredWindowStart = new Date(Date.now() - 70_000);
    mockedPrisma.rateLimit.findUnique.mockResolvedValue({
      coachId: 'coach-1',
      count: 60,
      windowStart: expiredWindowStart,
    });

    const result = await checkRateLimit('coach-1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(59);
    expect(mockedPrisma.rateLimit.upsert).toHaveBeenCalled();
  });
});
