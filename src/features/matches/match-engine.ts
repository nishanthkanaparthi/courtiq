// src/features/matches/match-engine.ts

import { Match, MatchSet, MatchPoint, Side, createSet, createGame, createTiebreakGame } from './types';
import { awardPoint, awardTiebreakPoint } from './scoring-engine';

/**
 * Records a single point for the given side, updating the current
 * game, and — if that point wins the game — cascading the update
 * up through the set and match as needed (starting a new game,
 * starting a tiebreak at 6-6, completing a set, completing the
 * match after 2 sets are won). Does not mutate the input match.
 */
export function recordPoint(match: Match, winner: Side): Match {
  if (match.status !== 'in-progress') {
    return match;
  }

  const set = match.sets[match.currentSetIndex];
  const game = set.games[match.currentGameIndex];

  const point: MatchPoint = {
    id: crypto.randomUUID(),
    pointNumber: game.points.length + 1,
    winner,
    timestamp: new Date().toISOString(),
  };

  const updatedGame = game.isTiebreak
    ? (() => {
        const result = awardTiebreakPoint(game, winner);
        return {
          ...game,
          tiebreakScore: result.tiebreakScore,
          winner: result.winner,
          points: [...game.points, point],
        };
      })()
    : (() => {
        const result = awardPoint(game, winner);
        return {
          ...game,
          score: result.score,
          winner: result.winner,
          points: [...game.points, point],
        };
      })();

  const updatedGames = [...set.games];
  updatedGames[match.currentGameIndex] = updatedGame;

  // Game not yet won -> just update the score in place
  if (!updatedGame.winner) {
    const updatedSet: MatchSet = { ...set, games: updatedGames };
    const updatedSets = [...match.sets];
    updatedSets[match.currentSetIndex] = updatedSet;
    return { ...match, sets: updatedSets };
  }

  // Game was won -> update the set's game count
  const gameWinner = updatedGame.winner;
  const playerGamesWon = set.playerGamesWon + (gameWinner === 'player' ? 1 : 0);
  const opponentGamesWon = set.opponentGamesWon + (gameWinner === 'opponent' ? 1 : 0);
  const setWinner = determineSetWinner(playerGamesWon, opponentGamesWon, updatedGame.isTiebreak);

  if (setWinner) {
    const completedSet: MatchSet = {
      ...set,
      games: updatedGames,
      playerGamesWon,
      opponentGamesWon,
      winner: setWinner,
    };
    const updatedSets = [...match.sets];
    updatedSets[match.currentSetIndex] = completedSet;

    const setsWonByPlayer = updatedSets.filter((s) => s.winner === 'player').length;
    const setsWonByOpponent = updatedSets.filter((s) => s.winner === 'opponent').length;

    if (setsWonByPlayer === 2 || setsWonByOpponent === 2) {
      return {
        ...match,
        sets: updatedSets,
        status: 'completed',
        completedAt: new Date().toISOString(),
        winner: setsWonByPlayer === 2 ? 'player' : 'opponent',
      };
    }

    // Set decided, match continues -> start a new set
    const nextSet = createSet(updatedSets.length + 1);
    return {
      ...match,
      sets: [...updatedSets, nextSet],
      currentSetIndex: updatedSets.length,
      currentGameIndex: 0,
    };
  }

  // Set not yet decided -> start the next game (tiebreak if 6-6)
  const nextGameNumber = updatedGames.length + 1;
  const nextGame =
    playerGamesWon === 6 && opponentGamesWon === 6
      ? createTiebreakGame(nextGameNumber)
      : createGame(nextGameNumber);

  const updatedSet: MatchSet = {
    ...set,
    games: [...updatedGames, nextGame],
    playerGamesWon,
    opponentGamesWon,
  };
  const updatedSets = [...match.sets];
  updatedSets[match.currentSetIndex] = updatedSet;

  return {
    ...match,
    sets: updatedSets,
    currentGameIndex: updatedGames.length,
  };
}

function determineSetWinner(
  playerGames: number,
  opponentGames: number,
  wasTiebreak: boolean
): Side | null {
  if (wasTiebreak) {
    // A tiebreak just finished; the winner's game count is now 7.
    if (playerGames === 7) return 'player';
    if (opponentGames === 7) return 'opponent';
    return null;
  }

  if (playerGames >= 6 && playerGames - opponentGames >= 2) return 'player';
  if (opponentGames >= 6 && opponentGames - playerGames >= 2) return 'opponent';
  return null;
}
/**
 * Marks an in-progress match as abandoned. A match that is already
 * completed cannot be abandoned — this is a no-op in that case,
 * since a decided match's result shouldn't be discarded. Does not
 * mutate the input match.
 */
export function abandonMatch(match: Match): Match {
  if (match.status !== 'in-progress') {
    return match;
  }

  return {
    ...match,
    status: 'abandoned',
    completedAt: new Date().toISOString(),
    winner: null,
  };
}