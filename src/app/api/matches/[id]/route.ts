import { NextResponse } from 'next/server';
import { abandonMatch } from '@/features/matches/match-engine';
import { PostgresMatchRepository, MatchRepository } from '@/lib/repositories/match-repository';
import { auth } from '@/auth';

function getRepository(): MatchRepository {
  return new PostgresMatchRepository();
}

export async function handleAbandonMatch(
  matchId: string,
  repository: MatchRepository,
  coachId: string | undefined
) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const match = await repository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }
  if (match.playerId !== coachId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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
  const session = await auth();
  return handleAbandonMatch(id, getRepository(), session?.user?.id);
}

export async function handleGetMatch(
  matchId: string,
  repository: MatchRepository,
  coachId: string | undefined
) {
  if (!coachId) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const match = await repository.findById(matchId);
  if (!match) {
    return NextResponse.json({ error: 'Match not found' }, { status: 404 });
  }
  if (match.playerId !== coachId) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  return NextResponse.json(match, { status: 200 });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth();
  return handleGetMatch(id, getRepository(), session?.user?.id);
}