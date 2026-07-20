// src/app/api/players/[playerId]/stats/route.ts

import { NextResponse } from 'next/server';
import { STAT_TYPES } from '@/features/stats/types';
import { summarizeStat } from '@/features/stats/stats-engine';
import { JsonStatRepository, StatRepository } from '@/lib/repositories/stat-repository';
import { JsonMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';

function getStatRepository(): StatRepository {
  return new JsonStatRepository();
}

function getMatchRepository(): MatchRepository {
  return new JsonMatchRepository();
}

export async function handleGetPlayerStats(
  playerId: string,
  statRepository: StatRepository,
  matchRepository: MatchRepository
) {
  const matches = await matchRepository.findByPlayerId(playerId);
  const matchIds = matches.map((m) => m.id);

  const entries = await statRepository.findByMatchIds(matchIds);
  const summaries = STAT_TYPES.map((statType) => summarizeStat(statType, entries));

  return NextResponse.json(summaries, { status: 200 });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;
  return handleGetPlayerStats(playerId, getStatRepository(), getMatchRepository());
}