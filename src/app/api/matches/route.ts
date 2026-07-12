// src/app/api/matches/route.ts

import { NextResponse } from 'next/server';
import { createMatch } from '@/features/matches/types';
import { JsonMatchRepository } from '@/lib/repositories/match-repository';

const repository = new JsonMatchRepository();

export async function POST(request: Request) {
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