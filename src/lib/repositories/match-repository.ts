import { Match, MatchFormat, MatchStatus, Side } from '@/features/matches/types';
import { prisma } from '@/lib/db/prisma-client';
import type { MatchModel as MatchRow } from '@/generated/prisma/models/Match';
import type { Prisma } from '@/generated/prisma/client';

export interface MatchRepository {
  findById(id: string): Promise<Match | null>;
  findByPlayerId(playerId: string): Promise<Match[]>;
  save(match: Match): Promise<void>;
}

function toDomainMatch(row: MatchRow): Match {
  return {
    id: row.id,
    playerId: row.playerId,
    opponentName: row.opponentName,
    format: row.format as MatchFormat,
    status: row.status as MatchStatus,
    startedAt: row.startedAt.toISOString(),
    completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    sets: row.sets as unknown as Match['sets'],
    currentSetIndex: row.currentSetIndex,
    currentGameIndex: row.currentGameIndex,
    winner: row.winner as Side | null,
  };
}

export class PostgresMatchRepository implements MatchRepository {
  async findById(id: string): Promise<Match | null> {
    const row = await prisma.match.findUnique({ where: { id } });
    return row ? toDomainMatch(row) : null;
  }

  async findByPlayerId(playerId: string): Promise<Match[]> {
    const rows = await prisma.match.findMany({ where: { playerId } });
    return rows.map(toDomainMatch);
  }

  async save(match: Match): Promise<void> {
    const data = {
      playerId: match.playerId,
      opponentName: match.opponentName,
      format: match.format,
      status: match.status,
      startedAt: new Date(match.startedAt),
      completedAt: match.completedAt ? new Date(match.completedAt) : null,
      sets: match.sets as unknown as Prisma.InputJsonValue,
      currentSetIndex: match.currentSetIndex,
      currentGameIndex: match.currentGameIndex,
      winner: match.winner,
    };

    await prisma.match.upsert({
      where: { id: match.id },
      create: { id: match.id, ...data },
      update: data,
    });
  }
}