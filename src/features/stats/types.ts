export type StatUnit = 'count' | 'percentage';

export type StatCategory = 'first-serve' | 'point-outcome' | 'break-point';

export interface StatType {
  id: string;
  key: string;
  label: string;
  unit: StatUnit;
  category: StatCategory;
}

export const STAT_TYPES: StatType[] = [
  { id: 'first-serve', key: 'first-serve', label: 'First Serve %', unit: 'percentage', category: 'first-serve' },
  { id: 'unforced-errors', key: 'unforced-errors', label: 'Unforced Errors', unit: 'count', category: 'point-outcome' },
  { id: 'winners', key: 'winners', label: 'Winners', unit: 'count', category: 'point-outcome' },
  { id: 'break-points-won', key: 'break-points-won', label: 'Break Points Won', unit: 'count', category: 'break-point' },
  { id: 'double-faults', key: 'double-faults', label: 'Double Faults', unit: 'count', category: 'point-outcome' },
];

export type StatOutcome = 'occurred' | 'in' | 'out';

export interface StatEntry {
  id: string;
  matchId: string;
  statTypeId: string;
  outcome: StatOutcome;
  pointNumber: number;
  timestamp: string;
}

export function createStatEntry(
  matchId: string,
  statTypeId: string,
  outcome: StatOutcome,
  pointNumber: number
): StatEntry {
  return {
    id: crypto.randomUUID(),
    matchId,
    statTypeId,
    outcome,
    pointNumber,
    timestamp: new Date().toISOString(),
  };
}