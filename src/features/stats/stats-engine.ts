// src/features/stats/stats-engine.ts

import { StatEntry, StatType } from './types';

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

/**
 * Summarizes a set of stat entries for one specific stat type. Works
 * identically whether given entries from a single match or a
 * player's entire history — the caller decides what's included.
 */
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