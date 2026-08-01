import { StatEntry, StatType, StatCategory, STAT_TYPES } from './types';

export interface CountStatSummary {
  unit: 'count';
  statTypeId: string;
  total: number;
}

export interface PercentageStatSummary {
  unit: 'percentage';
  statTypeId: string;
  inCount: number;
  outCount: number;
  percentage: number | null;
}

export type StatSummary = CountStatSummary | PercentageStatSummary;

export function summarizeStat(statType: StatType, entries: StatEntry[]): StatSummary {
  const relevantEntries = entries.filter((entry) => entry.statTypeId === statType.id);

  if (statType.unit === 'count') {
    return {
      unit: 'count',
      statTypeId: statType.id,
      total: relevantEntries.filter((entry) => entry.outcome === 'occurred').length,
    };
  }

  const inCount = relevantEntries.filter((entry) => entry.outcome === 'in').length;
  const outCount = relevantEntries.filter((entry) => entry.outcome === 'out').length;
  const totalAttempts = inCount + outCount;

  return {
    unit: 'percentage',
    statTypeId: statType.id,
    inCount,
    outCount,
    percentage: totalAttempts === 0 ? null : Math.round((inCount / totalAttempts) * 100),
  };
}

/**
 * Checks whether a stat of the given category has already been logged
 * for a specific point. Categories are independent of one another —
 * e.g. a Winner and a Break Point Won can both be logged for the same
 * point, but two point-outcome stats (Winner + Unforced Error) cannot.
 */
export function hasLoggedCategoryForPoint(
  category: StatCategory,
  pointNumber: number,
  entries: StatEntry[]
): boolean {
  return entries.some((entry) => {
    if (entry.pointNumber !== pointNumber) return false;
    const statType = STAT_TYPES.find((s) => s.id === entry.statTypeId);
    return statType?.category === category;
  });
}