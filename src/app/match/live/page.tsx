'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Scoreboard } from '@/components/match/Scoreboard';
import { PointControls } from '@/components/match/PointControls';
import { Match, Side } from '@/features/matches/types';
import { PLACEHOLDER_PLAYER_ID } from '@/features/players/constants';
import { STAT_TYPES, StatOutcome } from '@/features/stats/types';

export default function LiveMatchPage() {
  const [match, setMatch] = useState<Match | null>(null);
  const [opponentName, setOpponentName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatId, setSelectedStatId] = useState<string>(STAT_TYPES[0].id);

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
    } catch {
      setError('Something went wrong starting the match.');
    } finally {
      setIsLoading(false);
    }
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

  async function logStat(outcome: StatOutcome) {
    if (!match) return;
    setError(null);
    try {
      const response = await fetch(`/api/matches/${match.id}/stats`, {
        method: 'POST',
        body: JSON.stringify({ statTypeId: selectedStatId, outcome }),
      });
      if (!response.ok) {
        throw new Error('Could not log that stat.');
      }
    } catch {
      setError('Something went wrong logging that stat.');
    }
  }

  if (!match) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-semibold text-emerald-900">Start a Live Match</h1>
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
            className="rounded-xl bg-emerald-800 text-white text-sm font-medium px-4 py-2 disabled:opacity-40"
          >
            {isLoading ? 'Starting...' : 'Start Match'}
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-emerald-900">Live Match</h1>
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Scoreboard match={match} />
      <PointControls onPointWon={logPoint} disabled={match.status !== 'in-progress'} />

      {match.status === 'in-progress' && (
        <Card>
          <label className="block text-sm text-stone-600 mb-2" htmlFor="statSelect">
            Track a stat
          </label>
          <select
            id="statSelect"
            value={selectedStatId}
            onChange={(e) => setSelectedStatId(e.target.value)}
            className="w-full rounded-lg border border-stone-300 px-3 py-2 text-sm mb-3"
          >
            {STAT_TYPES.map((statType) => (
              <option key={statType.id} value={statType.id}>
                {statType.label}
              </option>
            ))}
          </select>

          {STAT_TYPES.find((s) => s.id === selectedStatId)?.unit === 'count' ? (
            <button
              onClick={() => logStat('occurred')}
              className="w-full rounded-xl bg-emerald-700 text-white text-sm font-medium py-2"
            >
              Log
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => logStat('in')}
                className="rounded-xl bg-emerald-700 text-white text-sm font-medium py-2"
              >
                In
              </button>
              <button
                onClick={() => logStat('out')}
                className="rounded-xl bg-emerald-700 text-white text-sm font-medium py-2"
              >
                Out
              </button>
            </div>
          )}
        </Card>
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