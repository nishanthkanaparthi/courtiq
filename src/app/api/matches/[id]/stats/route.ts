import { NextResponse } from 'next/server';
import { STAT_TYPES, StatOutcome, createStatEntry } from '@/features/stats/types';
import { summarizeStat, hasLoggedCategoryForPoint } from '@/features/stats/stats-engine';
import { JsonStatRepository, StatRepository } from '@/lib/repositories/stat-repository';
import { JsonMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';

function getStatRepository(): StatRepository {
  return new JsonStatRepository();
}

function getMatchRepository(): MatchRepository {
  return new JsonMatchRepository();
}

export async function handleLogStat(
  matchId: string,
  request: Request,
  statRepository: StatRepository,
  matchRepository: MatchRepository
) {
  const match = await matchRepository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
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
  matchRepository: MatchRepository
) {
  const match = await matchRepository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  const entries = await statRepository.findByMatchId(matchId);
  const summaries = STAT_TYPES.map((statType) => summarizeStat(statType, entries));

  return NextResponse.json(summaries, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleLogStat(id, request, getStatRepository(), getMatchRepository());
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleGetMatchStats(id, getStatRepository(), getMatchRepository());
}