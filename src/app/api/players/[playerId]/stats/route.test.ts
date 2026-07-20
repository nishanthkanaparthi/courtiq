/**
 * @jest-environment node
 */

import { handleGetPlayerStats } from './route';
import { Match, createMatch } from '@/features/matches/types';
import { MatchRepository } from '@/lib/repositories/match-repository';
import { StatEntry, createStatEntry } from '@/features/stats/types';
import { StatRepository } from '@/lib/repositories/stat-repository';

class FakeMatchRepository implements MatchRepository {
  private matches: Match[] = [];
  async findById(id: string): Promise<Match | null> {
    return this.matches.find((m) => m.id === id) ?? null;
  }
  async findByPlayerId(playerId: string): Promise<Match[]> {
    return this.matches.filter((m) => m.playerId === playerId);
  }
  async save(match: Match): Promise<void> {
    const i = this.matches.findIndex((m) => m.id === match.id);
    if (i >= 0) this.matches[i] = match;
    else this.matches.push(match);
  }
}

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

describe('handleGetPlayerStats', () => {
  it('returns a summary for every stat type even with no matches', async () => {
    const response = await handleGetPlayerStats(
      'player-1',
      new FakeStatRepository(),
      new FakeMatchRepository()
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.length).toBe(5);
  });

  it('aggregates stat entries across all of a players matches', async () => {
    const matchRepo = new FakeMatchRepository();
    const statRepo = new FakeStatRepository();

    const match1 = createMatch('player-1', 'Opponent A');
    const match2 = createMatch('player-1', 'Opponent B');
    await matchRepo.save(match1);
    await matchRepo.save(match2);

    await statRepo.save(createStatEntry(match1.id, 'winners', 'occurred'));
    await statRepo.save(createStatEntry(match2.id, 'winners', 'occurred'));

    const response = await handleGetPlayerStats('player-1', statRepo, matchRepo);
    const body = await response.json();

    const winnersSummary = body.find((s: { statTypeId: string }) => s.statTypeId === 'winners');
    expect(winnersSummary.total).toBe(2);
  });
});