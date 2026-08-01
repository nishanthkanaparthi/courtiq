import { Match } from './types';

export interface DashboardSummary {
  matchesPlayed: number;
  winRate: number | null;
  currentStreak: number;
}

/**
 * Summarizes a player's matches for the dashboard's quick-stats row.
 * matchesPlayed counts every match regardless of status. winRate and
 * currentStreak are calculated only from completed matches, since
 * in-progress and abandoned matches have no definitive result.
 */
export function summarizeMatches(matches: Match[]): DashboardSummary {
  const completed = matches.filter((m) => m.status === 'completed');
  const wins = completed.filter((m) => m.winner === 'player').length;

  const winRate = completed.length === 0 ? null : Math.round((wins / completed.length) * 100);

  const sortedByRecency = [...completed].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );

  let currentStreak = 0;
  for (const match of sortedByRecency) {
    if (match.winner === 'player') {
      currentStreak++;
    } else {
      break;
    }
  }

  return {
    matchesPlayed: matches.length,
    winRate,
    currentStreak,
  };
}