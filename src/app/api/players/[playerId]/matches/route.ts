// src/app/api/players/[playerId]/matches/route.ts

import { NextResponse } from 'next/server';
import { JsonMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';

function getRepository(): MatchRepository {
  return new JsonMatchRepository();
}

export async function handleGetPlayerMatches(playerId: string, repository: MatchRepository) {
  const matches = await repository.findByPlayerId(playerId);
  return NextResponse.json(matches, { status: 200 });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ playerId: string }> }
) {
  const { playerId } = await params;
  return handleGetPlayerMatches(playerId, getRepository());
}