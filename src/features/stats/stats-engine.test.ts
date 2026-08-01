import { createStatEntry, STAT_TYPES } from './types';
import { summarizeStat, hasLoggedCategoryForPoint } from './stats-engine';

describe('createStatEntry', () => {
  it('creates an entry with the given match, stat type, outcome, and point number', () => {
    const entry = createStatEntry('match-1', 'unforced-errors', 'occurred', 3);

    expect(entry.matchId).toBe('match-1');
    expect(entry.statTypeId).toBe('unforced-errors');
    expect(entry.outcome).toBe('occurred');
    expect(entry.pointNumber).toBe(3);
  });
});

describe('summarizeStat', () => {
  const unforcedErrors = STAT_TYPES.find((s) => s.key === 'unforced-errors')!;
  const firstServe = STAT_TYPES.find((s) => s.key === 'first-serve')!;

  it('sums count-type entries correctly, ignoring other stat types', () => {
    const entries = [
      createStatEntry('match-1', 'unforced-errors', 'occurred', 1),
      createStatEntry('match-1', 'unforced-errors', 'occurred', 2),
      createStatEntry('match-1', 'winners', 'occurred', 3),
    ];

    const summary = summarizeStat(unforcedErrors, entries);

    expect(summary.unit).toBe('count');
    if (summary.unit === 'count') {
      expect(summary.total).toBe(2);
    }
  });

  it('calculates percentage-type stats correctly', () => {
    const entries = [
      createStatEntry('match-1', 'first-serve', 'in', 1),
      createStatEntry('match-1', 'first-serve', 'in', 2),
      createStatEntry('match-1', 'first-serve', 'in', 3),
      createStatEntry('match-1', 'first-serve', 'out', 4),
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

describe('hasLoggedCategoryForPoint', () => {
  it('returns false when no entries exist for that point', () => {
    const result = hasLoggedCategoryForPoint('point-outcome', 1, []);

    expect(result).toBe(false);
  });

  it('returns true when a stat of the same category was already logged for that point', () => {
    const entries = [createStatEntry('match-1', 'winners', 'occurred', 1)];

    const result = hasLoggedCategoryForPoint('point-outcome', 1, entries);

    expect(result).toBe(true);
  });

  it('returns false for a different category, even on the same point', () => {
    const entries = [createStatEntry('match-1', 'winners', 'occurred', 1)];

    const result = hasLoggedCategoryForPoint('break-point', 1, entries);

    expect(result).toBe(false);
  });

  it('returns false for the same category on a different point', () => {
    const entries = [createStatEntry('match-1', 'winners', 'occurred', 1)];

    const result = hasLoggedCategoryForPoint('point-outcome', 2, entries);

    expect(result).toBe(false);
  });
});