import { NextResponse } from 'next/server';
import { STAT_TYPES } from '@/features/stats/types';
import { summarizeStat } from '@/features/stats/stats-engine';
import { PostgresStatRepository, StatRepository } from '@/lib/repositories/stat-repository';
import { PostgresMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';
import { auth } from '@/auth';

function getStatRepository(): StatRepository {
  return new PostgresStatRepository();
}

function getMatchRepository(): MatchRepository {
  return new PostgresMatchRepository();
}

export async function handleGetMyStats(
  statRepository: StatRepository,
  matchRepository: MatchRepository,
  coachId: string | undefined
) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const matches = await matchRepository.findByPlayerId(coachId);
  const matchIds = matches.map((m) => m.id);

  const entries = await statRepository.findByMatchIds(matchIds);
  const summaries = STAT_TYPES.map((statType) => summarizeStat(statType, entries));

  return NextResponse.json(summaries, { status: 200 });
}

export async function GET() {
  const session = await auth();
  return handleGetMyStats(getStatRepository(), getMatchRepository(), session?.user?.id);
}