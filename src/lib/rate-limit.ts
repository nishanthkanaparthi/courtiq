import { prisma } from '@/lib/db/prisma-client';

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 120;

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

export async function checkRateLimit(coachId: string): Promise<RateLimitResult> {
  const now = new Date();

  const existing = await prisma.rateLimit.findUnique({ where: { coachId } });

  if (!existing || now.getTime() - existing.windowStart.getTime() >= WINDOW_MS) {
    await prisma.rateLimit.upsert({
      where: { coachId },
      create: { coachId, count: 1, windowStart: now },
      update: { count: 1, windowStart: now },
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  await prisma.rateLimit.update({
    where: { coachId },
    data: { count: { increment: 1 } },
  });

  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - existing.count - 1 };
}
