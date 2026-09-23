/**
 * @jest-environment node
 */

import { handleRecordPoint } from './route';
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
    const index = this.matches.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      this.matches[index] = match;
    } else {
      this.matches.push(match);
    }
  }
}

describe('handleRecordPoint', () => {
  it('returns 400 for an invalid winner value', async () => {
    const repository = new FakeMatchRepository();
    const request = new Request('http://localhost/api/matches/123/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'nobody' }),
    });

    const response = await handleRecordPoint(request, '123', repository);

    expect(response.status).toBe(400);
  });

  it('returns 404 when the match does not exist', async () => {
    const repository = new FakeMatchRepository();
    const request = new Request('http://localhost/api/matches/nonexistent/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await handleRecordPoint(request, 'nonexistent', repository);

    expect(response.status).toBe(404);
  });

  it('records a point on an existing match', async () => {
    const repository = new FakeMatchRepository();
    const existingMatch = createMatch('player-1', 'Test Opponent');
    await repository.save(existingMatch);

    const request = new Request(`http://localhost/api/matches/${existingMatch.id}/points`, {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await handleRecordPoint(request, existingMatch.id, repository);
    const updated = await response.json();

    expect(response.status).toBe(200);
    expect(updated.sets[0].games[0].score.player).toBe(15);
  });
});