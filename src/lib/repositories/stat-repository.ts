// src/lib/repositories/stat-repository.ts

import { StatEntry } from '@/features/stats/types';
import { readStatEntries, writeStatEntries } from '@/lib/db/stats-store';

export interface StatRepository {
  findByMatchId(matchId: string): Promise<StatEntry[]>;
  findByMatchIds(matchIds: string[]): Promise<StatEntry[]>;
  save(entry: StatEntry): Promise<void>;
}

export class JsonStatRepository implements StatRepository {
  async findByMatchId(matchId: string): Promise<StatEntry[]> {
    const entries = await readStatEntries();
    return entries.filter((e) => e.matchId === matchId);
  }

  async findByMatchIds(matchIds: string[]): Promise<StatEntry[]> {
    const entries = await readStatEntries();
    return entries.filter((e) => matchIds.includes(e.matchId));
  }

  async save(entry: StatEntry): Promise<void> {
    const entries = await readStatEntries();
    entries.push(entry);
    await writeStatEntries(entries);
  }
}