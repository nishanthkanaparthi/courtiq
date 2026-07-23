'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Scoreboard } from '@/components/match/Scoreboard';
import { MatchPointHistory } from '@/components/match/MatchPointHistory';
import { MatchStats } from '@/components/match/MatchStats';
import { Match } from '@/features/matches/types';
import { StatSummary } from '@/features/stats/stats-engine';

type Tab = 'points' | 'stats';

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [statSummaries, setStatSummaries] = useState<StatSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('points');

  useEffect(() => {
    async function loadMatch() {
      try {
        const response = await fetch(`/api/matches/${params.id}`);
        if (!response.ok) {
          throw new Error('Could not load match.');
        }
        const data: Match = await response.json();
        setMatch(data);
      } catch {
        setError('Something went wrong loading this match.');
      }
    }
    async function loadStats() {
      try {
        const response = await fetch(`/api/matches/${params.id}/stats`);
        if (!response.ok) {
          throw new Error('Could not load match stats.');
        }
        const data: StatSummary[] = await response.json();
        setStatSummaries(data);
      } catch {
        // Stats are a secondary feature; a failure here shouldn't block
        // the rest of the page from showing the match itself.
      }
    }
    loadMatch();
    loadStats();
  }, [params.id]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-emerald-900">Match Detail</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!match && !error && <p className="text-sm text-stone-500">Loading...</p>}
      {match && (
        <>
          <Scoreboard match={match} />

          <div className="flex gap-4 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('points')}
              className={`text-sm pb-2 ${
                activeTab === 'points'
                  ? 'text-emerald-800 border-b-2 border-emerald-800 font-medium'
                  : 'text-stone-500'
              }`}
            >
              Points
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`text-sm pb-2 ${
                activeTab === 'stats'
                  ? 'text-emerald-800 border-b-2 border-emerald-800 font-medium'
                  : 'text-stone-500'
              }`}
            >
              Match Stats
            </button>
          </div>

          {activeTab === 'points' && <MatchPointHistory sets={match.sets} />}
          {activeTab === 'stats' &&
            (statSummaries ? (
              <MatchStats summaries={statSummaries} />
            ) : (
              <p className="text-sm text-stone-500">Loading stats...</p>
            ))}
        </>
      )}
    </div>
  );
}