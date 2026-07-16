'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Scoreboard } from '@/components/match/Scoreboard';
import { MatchPointHistory } from '@/components/match/MatchPointHistory';
import { Match } from '@/features/matches/types';

export default function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [error, setError] = useState<string | null>(null);

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
    loadMatch();
  }, [params.id]);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-emerald-900">Match Detail</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {!match && !error && <p className="text-sm text-stone-500">Loading...</p>}
      {match && (
        <>
          <Scoreboard match={match} />
          <MatchPointHistory sets={match.sets} />
        </>
      )}
    </div>
  );
}