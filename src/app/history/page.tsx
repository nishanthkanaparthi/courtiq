'use client';

import { useEffect, useState } from 'react';
import { MatchListItem } from '@/components/match/MatchListItem';
import { Match } from '@/features/matches/types';
import { PLACEHOLDER_PLAYER_ID } from '@/features/players/constants';

export default function HistoryPage() {
  const [matches, setMatches] = useState<Match[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadMatches() {
      try {
        const response = await fetch(`/api/players/${PLACEHOLDER_PLAYER_ID}/matches`);
        if (!response.ok) {
          throw new Error('Could not load match history.');
        }
        const data: Match[] = await response.json();
        setMatches(data);
      } catch {
        setError('Something went wrong loading match history.');
      }
    }
    loadMatches();
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-emerald-900">Match History</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      {matches === null && !error && <p className="text-sm text-stone-500">Loading...</p>}
      {matches !== null && matches.length === 0 && (
        <p className="text-sm text-stone-500">No matches recorded yet.</p>
      )}
      {matches !== null && (
        <div className="space-y-3">
          {matches.map((match) => (
            <MatchListItem key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}