'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { MatchSet } from '@/features/matches/types';

export function MatchPointHistory({ sets }: { sets: MatchSet[] }) {
  const [expandedGameIds, setExpandedGameIds] = useState<Set<string>>(new Set());

  function toggleGame(gameId: string) {
    setExpandedGameIds((prev) => {
      const next = new Set(prev);
      if (next.has(gameId)) {
        next.delete(gameId);
      } else {
        next.add(gameId);
      }
      return next;
    });
  }

  return (
    <div className="space-y-4">
      {sets.map((set) => (
        <Card key={set.id}>
          <p className="text-sm font-medium text-royal mb-2">
            Set {set.setNumber} — {set.playerGamesWon}-{set.opponentGamesWon}
          </p>
          <div className="space-y-1">
            {set.games.map((game) => {
              const isExpanded = expandedGameIds.has(game.id);
              return (
                <div key={game.id} className="border-t border-stone-100 pt-1">
                  <button
                    onClick={() => toggleGame(game.id)}
                    className="w-full flex justify-between items-center text-sm text-stone-600 py-1"
                  >
                    <span>
                      Game {game.gameNumber}
                      {game.isTiebreak ? ' (Tiebreak)' : ''}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">
                        {game.winner === 'player' ? 'Won' : game.winner === 'opponent' ? 'Lost' : ''}
                      </span>
                      <span>{isExpanded ? '▲' : '▼'}</span>
                    </span>
                  </button>
                  {isExpanded && (
                    <ul className="pl-4 pb-2 space-y-0.5">
                      {game.points.map((point) => (
                        <li key={point.id} className="text-xs text-stone-500">
                          Point {point.pointNumber}: {point.winner === 'player' ? 'You' : 'Opponent'}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      ))}
    </div>
  );
}