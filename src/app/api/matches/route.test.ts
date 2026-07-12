/**
 * @jest-environment node
 */

import { handleCreateMatch } from './route';
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
  it('returns 400 when playerId is missing', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ opponentName: 'Test Opponent' }),
    });

    const response = await handleCreateMatch(request, new FakeMatchRepository());

    expect(response.status).toBe(400);
  });

  it('returns 400 when opponentName is missing', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ playerId: 'player-1' }),
    });

    const response = await handleCreateMatch(request, new FakeMatchRepository());

    expect(response.status).toBe(400);
  });

  it('creates a match and returns 201 with valid input', async () => {
    const request = new Request('http://localhost/api/matches', {
      method: 'POST',
      body: JSON.stringify({ playerId: 'player-1', opponentName: 'Test Opponent' }),
    });

    const response = await handleCreateMatch(request, new FakeMatchRepository());
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.playerId).toBe('player-1');
    expect(body.opponentName).toBe('Test Opponent');
    expect(body.status).toBe('in-progress');
  });
});