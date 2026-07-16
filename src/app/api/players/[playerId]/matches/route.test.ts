/**
 * @jest-environment node
 */

import { handleGetPlayerMatches } from './route';
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

describe('handleGetPlayerMatches', () => {
  it('returns an empty array when the player has no matches', async () => {
    const repository = new FakeMatchRepository();

    const response = await handleGetPlayerMatches('player-1', repository);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual([]);
  });

  it('returns only matches belonging to the requested player', async () => {
    const repository = new FakeMatchRepository();
    await repository.save(createMatch('player-1', 'Opponent A'));
    await repository.save(createMatch('player-1', 'Opponent B'));
    await repository.save(createMatch('player-2', 'Opponent C'));

    const response = await handleGetPlayerMatches('player-1', repository);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.length).toBe(2);
    expect(body.every((m: Match) => m.playerId === 'player-1')).toBe(true);
  });
});