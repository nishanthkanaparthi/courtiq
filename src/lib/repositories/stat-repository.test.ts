// src/lib/repositories/stat-repository.test.ts

import { StatEntry } from '@/features/stats/types';
import { StatRepository } from './stat-repository';

class FakeStatRepository implements StatRepository {
  private entries: StatEntry[] = [];

  async findByMatchId(matchId: string): Promise<StatEntry[]> {
    return this.entries.filter((e) => e.matchId === matchId);
  }

  async findByMatchIds(matchIds: string[]): Promise<StatEntry[]> {
    return this.entries.filter((e) => matchIds.includes(e.matchId));
  }

  async save(entry: StatEntry): Promise<void> {
    this.entries.push(entry);
  }
}

function buildEntry(overrides: Partial<StatEntry> = {}): StatEntry {
  return {
    id: crypto.randomUUID(),
    matchId: 'match-1',
    statTypeId: 'unforced-errors',
    outcome: 'occurred',
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe('StatRepository (via FakeStatRepository)', () => {
  it('returns an empty array when a match has no stat entries', async () => {
    const repo = new FakeStatRepository();

    const result = await repo.findByMatchId('match-1');

    expect(result).toEqual([]);
  });

  it('saves and retrieves entries for a specific match', async () => {
    const repo = new FakeStatRepository();
    await repo.save(buildEntry({ matchId: 'match-1' }));
    await repo.save(buildEntry({ matchId: 'match-2' }));

    const result = await repo.findByMatchId('match-1');

    expect(result.length).toBe(1);
    expect(result[0].matchId).toBe('match-1');
  });

  it('finds entries across multiple matches at once', async () => {
    const repo = new FakeStatRepository();
    await repo.save(buildEntry({ matchId: 'match-1' }));
    await repo.save(buildEntry({ matchId: 'match-2' }));
    await repo.save(buildEntry({ matchId: 'match-3' }));

    const result = await repo.findByMatchIds(['match-1', 'match-3']);

    expect(result.length).toBe(2);
  });
});