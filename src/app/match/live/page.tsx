'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Scoreboard } from '@/components/match/Scoreboard';
import { PointControls } from '@/components/match/PointControls';
import { QuickStatButtons } from '@/components/match/QuickStatButtons';
import { Match, Side } from '@/features/matches/types';
import { PLACEHOLDER_PLAYER_ID } from '@/features/players/constants';
import { StatOutcome, StatCategory, StatSelections } from '@/features/stats/types';

export default function LiveMatchPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [opponentName, setOpponentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pointNumber, setPointNumber] = useState(1);
  const [statSelections, setStatSelections] = useState<StatSelections>({});

  async function startMatch() {
    if (opponentName.trim() === '') {
      setError('Enter an opponent name to start.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const response = await fetch('/api/matches', {
        method: 'POST',
        body: JSON.stringify({ playerId: PLACEHOLDER_PLAYER_ID, opponentName }),
      });
      if (!response.ok) {
        throw new Error('Could not start the match.');
      }
      const newMatch: Match = await response.json();
      setMatch(newMatch);
      setPointNumber(1);
      setStatSelections({});
    } catch {
      setError('Something went wrong starting the match.');
    } finally {
      setIsLoading(false);
    }
  }

  function toggleStatSelection(statTypeId: string, outcome: StatOutcome, category: StatCategory) {
    setStatSelections((prev) => {
      const current = prev[category];
      const isSame = current?.statTypeId === statTypeId && current?.outcome === outcome;
      if (isSame) {
        const next = { ...prev };
        delete next[category];
        return next;
      }
      return { ...prev, [category]: { statTypeId, outcome } };
    });
  }

  async function logPoint(winner: Side) {
    if (!match) return;
    setError(null);
    try {
      const response = await fetch(`/api/matches/${match.id}/points`, {
        method: 'POST',
        body: JSON.stringify({ winner }),
      });
      if (!response.ok) {
        throw new Error('Could not record the point.');
      }
      const updated: Match = await response.json();
      setMatch(updated);

      // Submit any stats selected for the point that just concluded,
      // tied to its point number (before it advances). Each is
      // best-effort — a stat logging failure shouldn't block the
      // match from continuing, since the point itself already saved.
      const completedPointNumber = pointNumber;
      for (const selection of Object.values(statSelections)) {
        try {
          await fetch(`/api/matches/${match.id}/stats`, {
            method: 'POST',
            body: JSON.stringify({
              statTypeId: selection.statTypeId,
              outcome: selection.outcome,
              pointNumber: completedPointNumber,
            }),
          });
        } catch {
          // Non-blocking; the point has already been recorded.
        }
      }

      setStatSelections({});
      setPointNumber((n) => n + 1);
    } catch {
      setError('Something went wrong recording that point.');
    }
  }

  async function handleAbandon() {
    if (!match) return;
    const confirmed = window.confirm(
      'Are you sure you want to abandon this match? This cannot be undone.'
    );
    if (!confirmed) return;

    setError(null);
    try {
      const response = await fetch(`/api/matches/${match.id}`, {
        method: 'PATCH',
      });
      if (!response.ok) {
        throw new Error('Could not abandon the match.');
      }
      const updated: Match = await response.json();
      setMatch(updated);
    } catch {
      setError('Something went wrong abandoning the match.');
    }
  }

  if (!match) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-royal">Start a Live Match</h1>
        <Card>
          <label className="block text-sm text-stone-600 mb-2" htmlFor="opponentName">
            Opponent name
          </label>
          <input
            id="opponentName"
            type="text"
            value={opponentName}
            onChange={(e) => setOpponentName(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm mb-4"
            placeholder="e.g. Jane Doe"
          />
          {error && <p className="text-sm text-red-700 mb-3">{error}</p>}
          <button
            onClick={startMatch}
            disabled={isLoading}
            className="rounded-xl bg-royal-light text-white text-sm font-medium px-4 py-2 disabled:opacity-40"
          >
            {isLoading ? 'Starting...' : 'Start Match'}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-royal">Live Match</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Scoreboard match={match} />
      <PointControls onPointWon={logPoint} disabled={match.status !== 'in-progress'} />

      {match.status === 'in-progress' && (
        <QuickStatButtons
          selections={statSelections}
          onToggle={toggleStatSelection}
          disabled={match.status !== 'in-progress'}
        />
      )}

      {match.status === 'in-progress' && (
        <button
          onClick={handleAbandon}
          className="text-sm text-red-700 underline"
        >
          Abandon Match
        </button>
      )}
    </div>
  );
}