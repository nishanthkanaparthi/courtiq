import { Card } from '@/components/ui/Card';
import { Match, PointValue } from '@/features/matches/types';

function displayPoint(value: PointValue): string {
  return value === 'Adv' ? 'Ad' : String(value);
}

export function Scoreboard({ match }: { match: Match }) {
  const currentSet = match.sets[match.currentSetIndex];
  const currentGame = currentSet.games[match.currentGameIndex];

  return (
    <Card>
      <div className="flex justify-between text-xs text-stone-500 mb-3">
        <span>vs {match.opponentName}</span>
        <span>
          Set {currentSet.setNumber} · Game {currentGame.gameNumber}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <div>
          <p className="text-sm text-stone-500">You</p>
          <p className="text-3xl font-semibold text-emerald-900">
            {currentGame.isTiebreak
              ? currentGame.tiebreakScore?.player ?? 0
              : displayPoint(currentGame.score.player)}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Sets: {match.sets.filter((s) => s.winner === 'player').length} · Games: {currentSet.playerGamesWon}
          </p>
        </div>
        <div>
          <p className="text-sm text-stone-500">Opponent</p>
          <p className="text-3xl font-semibold text-emerald-900">
            {currentGame.isTiebreak
              ? currentGame.tiebreakScore?.opponent ?? 0
              : displayPoint(currentGame.score.opponent)}
          </p>
          <p className="text-xs text-stone-400 mt-1">
            Sets: {match.sets.filter((s) => s.winner === 'opponent').length} · Games: {currentSet.opponentGamesWon}
          </p>
        </div>
      </div>

      {currentGame.isTiebreak && (
        <p className="text-center mt-3 text-xs text-emerald-700 font-medium">Tiebreak</p>
      )}

      {match.status === 'completed' && (
        <p className="text-center mt-4 text-emerald-700 font-medium">
          Match won by {match.winner === 'player' ? 'you' : 'opponent'}
        </p>
      )}
    </Card>
  );
}