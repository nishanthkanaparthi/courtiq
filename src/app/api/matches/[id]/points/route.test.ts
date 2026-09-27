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
    const i = this.matches.findIndex((m) => m.id === match.id);
    if (i >= 0) this.matches[i] = match;
    else this.matches.push(match);
  }
}

describe('handleRecordPoint', () => {
  it('returns 401 when there is no authenticated coach', async () => {
    const request = new Request('http://localhost/api/matches/123/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await handleRecordPoint(request, '123', new FakeMatchRepository(), undefined);

    expect(response.status).toBe(401);
  });

  it('returns 400 for an invalid winner value', async () => {
    const request = new Request('http://localhost/api/matches/123/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'nobody' }),
    });

    const response = await handleRecordPoint(request, '123', new FakeMatchRepository(), 'coach-1');

    expect(response.status).toBe(400);
  });

  it('returns 404 when the match does not exist', async () => {
    const request = new Request('http://localhost/api/matches/nonexistent/points', {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await handleRecordPoint(request, 'nonexistent', new FakeMatchRepository(), 'coach-1');

    expect(response.status).toBe(404);
  });

  it('returns 403 when the match belongs to a different coach', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save(match);

    const request = new Request(`http://localhost/api/matches/${match.id}/points`, {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await handleRecordPoint(request, match.id, repo, 'coach-2');

    expect(response.status).toBe(403);
  });

  it('records a point on a match owned by the requesting coach', async () => {
    const repo = new FakeMatchRepository();
    const match = createMatch('coach-1', 'Test Opponent');
    await repo.save(match);

    const request = new Request(`http://localhost/api/matches/${match.id}/points`, {
      method: 'POST',
      body: JSON.stringify({ winner: 'player' }),
    });

    const response = await handleRecordPoint(request, match.id, repo, 'coach-1');
    const updated = await response.json();

    expect(response.status).toBe(200);
    expect(updated.sets[0].games[0].score.player).toBe(15);
  });
});