// src/app/api/matches/[id]/route.ts

import { NextResponse } from 'next/server';
import { abandonMatch } from '@/features/matches/match-engine';
import { JsonMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';

function getRepository(): MatchRepository {
  return new JsonMatchRepository();
}

export async function handleAbandonMatch(matchId: string, repository: MatchRepository) {
  const match = await repository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }

  if (match.status !== 'in-progress') {
    return NextResponse.json(
      { error: 'Only an in-progress match can be abandoned' },
      { status: 400 }
    );
  }

  const updated = abandonMatch(match);
  await repository.save(updated);

  return NextResponse.json(updated, { status: 200 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleAbandonMatch(id, getRepository());
}

export async function handleGetMatch(matchId: string, repository: MatchRepository) {
  const match = await repository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }
  return NextResponse.json(match, { status: 200 });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return handleGetMatch(id, getRepository());
}