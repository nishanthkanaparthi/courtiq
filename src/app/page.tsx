'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { MatchListItem } from '@/components/match/MatchListItem';
import { MatchStats } from '@/components/match/MatchStats';
import { Match } from '@/features/matches/types';
import { summarizeMatches } from '@/features/matches/dashboard-summary';
import { StatSummary } from '@/features/stats/stats-engine';
import { PLACEHOLDER_PLAYER_ID, PLACEHOLDER_PLAYER_NAME } from '@/features/players/constants';
import { CalendarDays, TrendingUp, Flame } from 'lucide-react';

export default function DashboardPage() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [statSummaries, setStatSummaries] = useState<StatSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [matchesRes, statsRes] = await Promise.all([
          fetch(`/api/players/${PLACEHOLDER_PLAYER_ID}/matches`),
          fetch(`/api/players/${PLACEHOLDER_PLAYER_ID}/stats`),
        ]);
        if (!matchesRes.ok || !statsRes.ok) {
          throw new Error('Could not load dashboard.');
        }
        setMatches(await matchesRes.json());
        setStatSummaries(await statsRes.json());
      } catch {
        setError('Something went wrong loading your dashboard.');
      }
    }
    loadDashboard();
  }, []);

  if (error) {
    return <p className="text-sm text-red-700">{error}</p>;
  }

  if (!matches || !statSummaries) {
    return <p className="text-sm text-stone-500">Loading...</p>;
  }

  const summary = summarizeMatches(matches);
  const recentMatches = [...matches]
    .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-semibold text-royal">
            Welcome back, {PLACEHOLDER_PLAYER_NAME}
          </h1>
          <p className="text-sm text-stone-500 mt-1">Track every match, one point at a time.</p>
        </div>
        <Link
          href="/match/live"
          className="rounded-full bg-royal-light text-white text-sm font-medium px-4 py-2 hover:bg-royal"
        >
          + Start Match
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <CalendarDays size={16} className="text-royal-light" />
            <span className="text-xs text-stone-500">Matches Played</span>
          </div>
          <p className="text-2xl font-semibold text-royal">{summary.matchesPlayed}</p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-royal-light" />
            <span className="text-xs text-stone-500">Win Rate</span>
          </div>
          <p className="text-2xl font-semibold text-royal">
            {summary.winRate === null ? '—' : `${summary.winRate}%`}
          </p>
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-2">
            <Flame size={16} className="text-amber-500" />
            <span className="text-xs text-stone-500">Current Streak</span>
          </div>
          <p className="text-2xl font-semibold text-royal">{summary.currentStreak} Matches</p>
        </Card>
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-stone-700">Recent Matches</h2>
          <Link href="/history" className="text-xs text-royal-light hover:underline">
            View All
          </Link>
        </div>
        {recentMatches.length === 0 ? (
          <p className="text-sm text-stone-500">No matches yet — start your first one above.</p>
        ) : (
          <div className="space-y-2">
            {recentMatches.map((match) => (
              <MatchListItem key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-sm font-semibold text-stone-700">Stats Snapshot</h2>
          <Link href="/analytics" className="text-xs text-royal-light hover:underline">
            View Analytics
          </Link>
        </div>
        <MatchStats summaries={statSummaries} />
      </div>
    </div>
  );
}