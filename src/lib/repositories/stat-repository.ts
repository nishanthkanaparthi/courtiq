import { StatEntry, StatOutcome } from '@/features/stats/types';
import { prisma } from '@/lib/db/prisma-client';
import type { StatEntryModel as StatEntryRow } from '@/generated/prisma/models/StatEntry';

export interface StatRepository {
  findByMatchId(matchId: string): Promise<StatEntry[]>;
  findByMatchIds(matchIds: string[]): Promise<StatEntry[]>;
  save(entry: StatEntry): Promise<void>;
}

function toDomainStatEntry(row: StatEntryRow): StatEntry {
  return {
    id: row.id,
    matchId: row.matchId,
    statTypeId: row.statTypeId,
    outcome: row.outcome as StatOutcome,
    pointNumber: row.pointNumber,
    timestamp: row.timestamp.toISOString(),
  };
}

export class PostgresStatRepository implements StatRepository {
  async findByMatchId(matchId: string): Promise<StatEntry[]> {
    const rows = await prisma.statEntry.findMany({ where: { matchId } });
    return rows.map(toDomainStatEntry);
  }

  async findByMatchIds(matchIds: string[]): Promise<StatEntry[]> {
    const rows = await prisma.statEntry.findMany({ where: { matchId: { in: matchIds } } });
    return rows.map(toDomainStatEntry);
  }

  async save(entry: StatEntry): Promise<void> {
    await prisma.statEntry.create({
      data: {
        id: entry.id,
        matchId: entry.matchId,
        statTypeId: entry.statTypeId,
        outcome: entry.outcome,
        pointNumber: entry.pointNumber,
        timestamp: new Date(entry.timestamp),
      },
    });
  }
}