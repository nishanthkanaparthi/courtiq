/**
 * @jest-environment node
 */

import { handleLogStat, handleGetMatchStats } from './route';
import { Match, createMatch } from '@/features/matches/types';
import { MatchRepository } from '@/lib/repositories/match-repository';
import { StatEntry } from '@/features/stats/types';
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

describe('handleLogStat', () => {
  it('returns 404 when the match does not exist', async () => {
    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ statTypeId: 'winners', outcome: 'occurred' }),
    });

    const response = await handleLogStat(
      'nonexistent',
      request,
      new FakeStatRepository(),
      new FakeMatchRepository()
    );

    expect(response.status).toBe(404);
  });

  it('returns 400 for an unknown statTypeId', async () => {
    const matchRepo = new FakeMatchRepository();
    const match = createMatch('player-1', 'Test Opponent');
    await matchRepo.save(match);

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ statTypeId: 'not-a-real-stat', outcome: 'occurred' }),
    });

    const response = await handleLogStat(match.id, request, new FakeStatRepository(), matchRepo);

    expect(response.status).toBe(400);
  });

  it('returns 400 when the outcome does not match the stat unit', async () => {
    const matchRepo = new FakeMatchRepository();
    const match = createMatch('player-1', 'Test Opponent');
    await matchRepo.save(match);

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ statTypeId: 'winners', outcome: 'in' }),
    });

    const response = await handleLogStat(match.id, request, new FakeStatRepository(), matchRepo);

    expect(response.status).toBe(400);
  });

  it('logs a valid stat entry', async () => {
    const matchRepo = new FakeMatchRepository();
    const match = createMatch('player-1', 'Test Opponent');
    await matchRepo.save(match);

    const request = new Request('http://localhost', {
      method: 'POST',
      body: JSON.stringify({ statTypeId: 'winners', outcome: 'occurred' }),
    });

    const response = await handleLogStat(match.id, request, new FakeStatRepository(), matchRepo);
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.statTypeId).toBe('winners');
  });
});

describe('handleGetMatchStats', () => {
  it('returns 404 when the match does not exist', async () => {
    const response = await handleGetMatchStats(
      'nonexistent',
      new FakeStatRepository(),
      new FakeMatchRepository()
    );

    expect(response.status).toBe(404);
  });

  it('returns a summary for every stat type', async () => {
    const matchRepo = new FakeMatchRepository();
    const match = createMatch('player-1', 'Test Opponent');
    await matchRepo.save(match);

    const response = await handleGetMatchStats(match.id, new FakeStatRepository(), matchRepo);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.length).toBe(5);
  });
}); 