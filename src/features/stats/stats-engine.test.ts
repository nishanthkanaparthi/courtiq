// src/features/stats/stats-engine.test.ts

import { createStatEntry, STAT_TYPES } from './types';
import { summarizeStat } from './stats-engine';

describe('createStatEntry', () => {
  it('creates an entry with the given match, stat type, and outcome', () => {
    const entry = createStatEntry('match-1', 'unforced-errors', 'occurred');

    expect(entry.matchId).toBe('match-1');
    expect(entry.statTypeId).toBe('unforced-errors');
    expect(entry.outcome).toBe('occurred');
  });
});

describe('summarizeStat', () => {
  const unforcedErrors = STAT_TYPES.find((s) => s.key === 'unforced-errors')!;
  const firstServe = STAT_TYPES.find((s) => s.key === 'first-serve')!;

  it('sums count-type entries correctly, ignoring other stat types', () => {
    const entries = [
      createStatEntry('match-1', 'unforced-errors', 'occurred'),
      createStatEntry('match-1', 'unforced-errors', 'occurred'),
      createStatEntry('match-1', 'winners', 'occurred'),
    ];

    const summary = summarizeStat(unforcedErrors, entries);

    expect(summary.unit).toBe('count');
    if (summary.unit === 'count') {
      expect(summary.total).toBe(2);
    }
  });

  it('calculates percentage-type stats correctly', () => {
    const entries = [
      createStatEntry('match-1', 'first-serve', 'in'),
      createStatEntry('match-1', 'first-serve', 'in'),
      createStatEntry('match-1', 'first-serve', 'in'),
      createStatEntry('match-1', 'first-serve', 'out'),
    ];

    const summary = summarizeStat(firstServe, entries);

    expect(summary.unit).toBe('percentage');
    if (summary.unit === 'percentage') {
      expect(summary.inCount).toBe(3);
      expect(summary.outCount).toBe(1);
      expect(summary.percentage).toBe(75);
    }
  });

  it('returns a null percentage when there is no data for that stat', () => {
    const summary = summarizeStat(firstServe, []);

    expect(summary.unit).toBe('percentage');
    if (summary.unit === 'percentage') {
      expect(summary.percentage).toBeNull();
    }
  });
});