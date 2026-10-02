import { NextResponse } from 'next/server';
import { STAT_TYPES, StatOutcome, createStatEntry } from '@/features/stats/types';
import { summarizeStat, hasLoggedCategoryForPoint } from '@/features/stats/stats-engine';
import { PostgresStatRepository, StatRepository } from '@/lib/repositories/stat-repository';
import { PostgresMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';
import { withErrorLogging } from '@/lib/api/with-error-logging';

function getStatRepository(): StatRepository {
  return new PostgresStatRepository();
}

function getMatchRepository(): MatchRepository {
  return new PostgresMatchRepository();
}

export async function handleLogStat(
  matchId: string,
  request: Request,
  statRepository: StatRepository,
  matchRepository: MatchRepository,
  coachId: string | undefined
) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const match = await matchRepository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }
  if (match.playerId !== coachId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const statType = STAT_TYPES.find((s) => s.id === body.statTypeId);
  if (!statType) {
    return NextResponse.json({ error: 'Unknown statTypeId' }, { status: 400 });
  }

  const outcome = body.outcome as StatOutcome | undefined;
  const validOutcomes: StatOutcome[] =
    statType.unit === 'count' ? ['occurred'] : ['in', 'out'];

  if (!outcome || !validOutcomes.includes(outcome)) {
    return NextResponse.json(
      { error: `outcome must be one of: ${validOutcomes.join(', ')}` },
      { status: 400 }
    );
  }

  const pointNumber = body.pointNumber;
  if (typeof pointNumber !== 'number') {
    return NextResponse.json({ error: 'pointNumber is required' }, { status: 400 });
  }

  const existingEntries = await statRepository.findByMatchId(matchId);
  if (hasLoggedCategoryForPoint(statType.category, pointNumber, existingEntries)) {
    return NextResponse.json(
      { error: `A ${statType.category.replace('-', ' ')} stat has already been logged for this point` },
      { status: 400 }
    );
  }

  const entry = createStatEntry(matchId, statType.id, outcome, pointNumber);
  await statRepository.save(entry);

  return NextResponse.json(entry, { status: 201 });
}

export async function handleGetMatchStats(
  matchId: string,
  statRepository: StatRepository,
  matchRepository: MatchRepository,
  coachId: string | undefined
) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const match = await matchRepository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }
  if (match.playerId !== coachId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const entries = await statRepository.findByMatchId(matchId);
  const summaries = STAT_TYPES.map((statType) => summarizeStat(statType, entries));

  return NextResponse.json(summaries, { status: 200 });
}

export const POST = withErrorLogging(
  'POST /api/matches/[id]/stats',
  async (
    coachId: string | undefined,
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    return handleLogStat(id, request, getStatRepository(), getMatchRepository(), coachId);
  }
);

export const GET = withErrorLogging(
  'GET /api/matches/[id]/stats',
  async (
    coachId: string | undefined,
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) => {
    const { id } = await params;
    return handleGetMatchStats(id, getStatRepository(), getMatchRepository(), coachId);
  }
);
