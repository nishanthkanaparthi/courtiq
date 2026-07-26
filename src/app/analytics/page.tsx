'use client';

import { useEffect, useState } from 'react';
import { MatchStats } from '@/components/match/MatchStats';
import { StatSummary } from '@/features/stats/stats-engine';
import { PLACEHOLDER_PLAYER_ID } from '@/features/players/constants';

export default function AnalyticsPage() {
  const [summaries, setSummaries] = useState<StatSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch(`/api/players/${PLACEHOLDER_PLAYER_ID}/stats`);
        if (!response.ok) {
          throw new Error('Could not load analytics.');
        }
        const data: StatSummary[] = await response.json();
        setSummaries(data);
      } catch {
        setError('Something went wrong loading your analytics.');
      }
    }
    loadStats();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-royal">Analytics</h1>
        <p className="text-sm text-stone-500">Performance trends across your full match history.</p>
      </div>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!summaries && !error && <p className="text-sm text-stone-500">Loading...</p>}
      {summaries && <MatchStats summaries={summaries} />}
    </div>
  );
}