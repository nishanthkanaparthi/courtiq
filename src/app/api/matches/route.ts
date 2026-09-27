import { NextResponse } from 'next/server';
import { createMatch } from '@/features/matches/types';
import { PostgresMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';
import { auth } from '@/auth';

function getRepository(): MatchRepository {
  return new PostgresMatchRepository();
}

export async function handleCreateMatch(
  request: Request,
  repository: MatchRepository,
  coachId: string | undefined
) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const body = await request.json();

  if (typeof body.opponentName !== 'string' || body.opponentName.trim() === '') {
    return NextResponse.json({ error: 'opponentName is required' }, { status: 400 });
  }

  const match = createMatch(coachId, body.opponentName);
  await repository.save(match);

  return NextResponse.json(match, { status: 201 });
}

export async function handleGetMyMatches(repository: MatchRepository, coachId: string | undefined) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const matches = await repository.findByPlayerId(coachId);
  return NextResponse.json(matches, { status: 200 });
}

export async function POST(request: Request) {
  const session = await auth();
  return handleCreateMatch(request, getRepository(), session?.user?.id);
}

export async function GET() {
  const session = await auth();
  return handleGetMyMatches(getRepository(), session?.user?.id);
}