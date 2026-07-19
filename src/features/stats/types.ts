// src/features/stats/types.ts

export type StatUnit = 'count' | 'percentage';

export interface StatType {
  id: string;
  key: string;
  label: string;
  unit: StatUnit;
}

export const STAT_TYPES: StatType[] = [
  { id: 'first-serve', key: 'first-serve', label: 'First Serve %', unit: 'percentage' },
  { id: 'unforced-errors', key: 'unforced-errors', label: 'Unforced Errors', unit: 'count' },
  { id: 'winners', key: 'winners', label: 'Winners', unit: 'count' },
  { id: 'break-points-won', key: 'break-points-won', label: 'Break Points Won', unit: 'count' },
  { id: 'double-faults', key: 'double-faults', label: 'Double Faults', unit: 'count' },
];

export type StatOutcome = 'occurred' | 'in' | 'out';

export interface StatEntry {
  id: string;
  matchId: string;
  statTypeId: string;
  outcome: StatOutcome;
  timestamp: string;
}

export function createStatEntry(
  matchId: string,
  statTypeId: string,
  outcome: StatOutcome
): StatEntry {
  return {
    id: crypto.randomUUID(),
    matchId,
    statTypeId,
    outcome,
    timestamp: new Date().toISOString(),
  };
}