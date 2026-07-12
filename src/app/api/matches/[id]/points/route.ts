// src/app/api/matches/[id]/points/route.ts

import { NextResponse } from 'next/server';
import { recordPoint } from '@/features/matches/match-engine';
import { JsonMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';
import { Side } from '@/features/matches/types';

function getRepository(): MatchRepository {
  return new JsonMatchRepository();
}

export async function handleRecordPoint(
  request: Request,
  matchId: string,
  repository: MatchRepository
) {
  const body = await request.json();
  const winner = body.winner as Side | undefined;

  if (winner !== 'player' && winner !== 'opponent') {
    return NextResponse.json(
      { error: 'winner must be "player" or "opponent"' },
      { status: 400 }
    );
  }

  const match = await repository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  const updated = recordPoint(match, winner);
  await repository.save(updated);

  return NextResponse.json(updated, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleRecordPoint(request, id, getRepository());
}