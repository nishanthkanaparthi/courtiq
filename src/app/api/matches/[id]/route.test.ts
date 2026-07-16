/**
 * @jest-environment node
 */

import { handleAbandonMatch } from './route';
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

describe('handleAbandonMatch', () => {
  it('returns 404 when the match does not exist', async () => {
    const repository = new FakeMatchRepository();

    const response = await handleAbandonMatch('nonexistent', repository);

    expect(response.status).toBe(404);
  });

  it('abandons an in-progress match', async () => {
    const repository = new FakeMatchRepository();
    const match = createMatch('player-1', 'Test Opponent');
    await repository.save(match);

    const response = await handleAbandonMatch(match.id, repository);
    const updated = await response.json();

    expect(response.status).toBe(200);
    expect(updated.status).toBe('abandoned');
  });

  it('returns 400 when trying to abandon a completed match', async () => {
    const repository = new FakeMatchRepository();
    const match = createMatch('player-1', 'Test Opponent');
    const completedMatch = { ...match, status: 'completed' as const };
    await repository.save(completedMatch);

    const response = await handleAbandonMatch(match.id, repository);

    expect(response.status).toBe(400);
  });
});