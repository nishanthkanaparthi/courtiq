/**
 * @jest-environment node
 */

import { handleCreateMatch, handleGetMyMatches } from './route';
import { Match } from '@/features/matches/types';
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
    const index = this.matches.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      this.matches[index] = match;
    } else {
      this.matches.push(match);
    }
  }
}

describe('handleCreateMatch', () => {
  it('returns 401 when there is no authenticated coach', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ opponentName: 'Test Opponent' }),
    });

    const response = await handleCreateMatch(request, new FakeMatchRepository(), undefined);

    expect(response.status).toBe(401);
  });

  it('returns 400 when opponentName is missing', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    const response = await handleCreateMatch(request, new FakeMatchRepository(), 'coach-1');

    expect(response.status).toBe(400);
  });

  it('creates a match owned by the authenticated coach', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ opponentName: 'Test Opponent' }),
    });

    const response = await handleCreateMatch(request, new FakeMatchRepository(), 'coach-1');
    const match = await response.json();

    expect(response.status).toBe(201);
    expect(match.playerId).toBe('coach-1');
    expect(match.opponentName).toBe('Test Opponent');
  });
});

describe('handleGetMyMatches', () => {
  it('returns 401 when there is no authenticated coach', async () => {
    const response = await handleGetMyMatches(new FakeMatchRepository(), undefined);

    expect(response.status).toBe(401);
  });

  it("returns only the authenticated coach's own matches", async () => {
    const repository = new FakeMatchRepository();

    await handleCreateMatch(
      new Request('http://localhost/api/matches', {
        method: 'POST',
        body: JSON.stringify({ opponentName: 'Opponent A' }),
      }),
      repository,
      'coach-1'
    );
    await handleCreateMatch(
      new Request('http://localhost/api/matches', {
        method: 'POST',
        body: JSON.stringify({ opponentName: 'Opponent B' }),
      }),
      repository,
      'coach-2'
    );

    const response = await handleGetMyMatches(repository, 'coach-1');
    const matches = await response.json();

    expect(response.status).toBe(200);
    expect(matches.length).toBe(1);
    expect(matches[0].opponentName).toBe('Opponent A');
  });
});