/**
 * @jest-environment node
 */

import { handleAbandonMatch, handleGetMatch } from './route';
import { Match, createMatch } from '@/features/matches/types';
import { MatchRepository } from '@/lib/repositories/match-repository';

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

describe('handleAbandonMatch', () => {
  it('returns 401 when there is no authenticated coach', async () => {
    const response = await handleAbandonMatch('123', new FakeMatchRepository(), undefined);
    expect(response.status).toBe(401);
  });

  it('returns 404 when the match does not exist', async () => {
    const response = await handleAbandonMatch('nonexistent', new FakeMatchRepository(), 'coach-1');
    expect(response.status).toBe(404);
  });

  it('returns 403 when the match belongs to a different coach', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save(match);

    const response = await handleAbandonMatch(match.id, repo, 'coach-2');

    expect(response.status).toBe(403);
  });

  it('abandons an in-progress match owned by the requesting coach', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save(match);

    const response = await handleAbandonMatch(match.id, repo, 'coach-1');
    const updated = await response.json();

    expect(response.status).toBe(200);
    expect(updated.status).toBe('abandoned');
  });

  it('returns 400 when the match is not in-progress', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save({ ...match, status: 'completed' });

    const response = await handleAbandonMatch(match.id, repo, 'coach-1');

    expect(response.status).toBe(400);
  });
});

describe('handleGetMatch', () => {
  it('returns 401 when there is no authenticated coach', async () => {
    const response = await handleGetMatch('123', new FakeMatchRepository(), undefined);
    expect(response.status).toBe(401);
  });

  it('returns 404 when the match does not exist', async () => {
    const response = await handleGetMatch('nonexistent', new FakeMatchRepository(), 'coach-1');
    expect(response.status).toBe(404);
  });

  it('returns 403 when the match belongs to a different coach', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save(match);

    const response = await handleGetMatch(match.id, repo, 'coach-2');

    expect(response.status).toBe(403);
  });

  it('returns the match when it belongs to the requesting coach', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save(match);

    const response = await handleGetMatch(match.id, repo, 'coach-1');
    const result = await response.json();

    expect(response.status).toBe(200);
    expect(result.id).toBe(match.id);
  });
});