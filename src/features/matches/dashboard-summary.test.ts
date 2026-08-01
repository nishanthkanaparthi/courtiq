import { createMatch, Match } from './types';
import { summarizeMatches } from './dashboard-summary';

function completedMatch(overrides: Partial<Match> = {}): Match {
  const match = createMatch('player-1', 'Test Opponent');
  return {
    ...match,
    status: 'completed',
    completedAt: new Date().toISOString(),
    winner: 'player',
    ...overrides,
  };
}

describe('summarizeMatches', () => {
  it('returns zero/null values when there are no matches', () => {
    const summary = summarizeMatches([]);

    expect(summary.matchesPlayed).toBe(0);
    expect(summary.winRate).toBeNull();
    expect(summary.currentStreak).toBe(0);
  });

  it('counts matchesPlayed as the total number of matches regardless of status', () => {
    const inProgress = createMatch('player-1', 'Opponent A');
    const completed = completedMatch();

    const summary = summarizeMatches([inProgress, completed]);

    expect(summary.matchesPlayed).toBe(2);
  });

  it('calculates win rate from completed matches only', () => {
    const win = completedMatch({ id: 'm1', winner: 'player' });
    const loss = completedMatch({ id: 'm2', winner: 'opponent' });

    const summary = summarizeMatches([win, loss]);

    expect(summary.winRate).toBe(50);
  });

  it('calculates a current win streak from the most recent completed matches', () => {
    const older = completedMatch({
      id: 'm1',
      winner: 'opponent',
      startedAt: new Date('2026-01-01').toISOString(),
    });
    const middle = completedMatch({
      id: 'm2',
      winner: 'player',
      startedAt: new Date('2026-01-02').toISOString(),
    });
    const recent = completedMatch({
      id: 'm3',
      winner: 'player',
      startedAt: new Date('2026-01-03').toISOString(),
    });

    const summary = summarizeMatches([older, middle, recent]);

    expect(summary.currentStreak).toBe(2);
  });
});