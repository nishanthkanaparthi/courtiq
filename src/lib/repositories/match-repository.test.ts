import { Match } from '@/features/matches/types';
import { MatchRepository } from './match-repository';

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

function buildMatch(overrides: Partial<Match> = {}): Match {
  return {
    id: 'match-1',
    playerId: 'player-1',
    opponentName: 'Test Opponent',
    format: 'best-of-3',
    status: 'in-progress',
    startedAt: new Date().toISOString(),
    completedAt: null,
    sets: [],
    currentSetIndex: 0,
    currentGameIndex: 0,
    winner: null,
    ...overrides,
  };
}

describe('MatchRepository (via FakeMatchRepository)', () => {
  it('returns null when a match is not found', async () => {
    const repo = new FakeMatchRepository();
    const result = await repo.findById('nonexistent');
    expect(result).toBeNull();
  });

  it('saves and retrieves a match by id', async () => {
    const repo = new FakeMatchRepository();
    const match = buildMatch({ id: 'match-1' });

    await repo.save(match);
    const result = await repo.findById('match-1');

    expect(result).toEqual(match);
  });

  it('updates an existing match on save rather than duplicating it', async () => {
    const repo = new FakeMatchRepository();
    const match = buildMatch({ id: 'match-1', status: 'in-progress' });
    await repo.save(match);

    const updated = { ...match, status: 'completed' as const };
    await repo.save(updated);

    const all = await repo.findByPlayerId('player-1');
    expect(all.length).toBe(1);
    expect(all[0].status).toBe('completed');
  });

  it('finds matches by player id, excluding other players matches', async () => {
    const repo = new FakeMatchRepository();
    await repo.save(buildMatch({ id: 'match-1', playerId: 'player-1' }));
    await repo.save(buildMatch({ id: 'match-2', playerId: 'player-2' }));

    const result = await repo.findByPlayerId('player-1');

    expect(result.length).toBe(1);
    expect(result[0].id).toBe('match-1');
  });
});