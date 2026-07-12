// src/app/api/matches/route.ts

import { NextResponse } from 'next/server';
import { createMatch } from '@/features/matches/types';
import { JsonMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';

function getRepository(): MatchRepository {
  return new JsonMatchRepository();
}

export async function handleCreateMatch(request: Request, repository: MatchRepository) {
  const body = await request.json();

  if (typeof body.playerId !== 'string' || body.playerId.trim() === '') {
    return NextResponse.json({ error: 'playerId is required' }, { status: 400 });
  }
  if (typeof body.opponentName !== 'string' || body.opponentName.trim() === '') {
    return NextResponse.json({ error: 'opponentName is required' }, { status: 400 });
  }

  const match = createMatch(body.playerId, body.opponentName);
  await repository.save(match);

  return NextResponse.json(match, { status: 201 });
}

export async function POST(request: Request) {
  return handleCreateMatch(request, getRepository());
}