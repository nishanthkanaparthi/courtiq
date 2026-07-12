// src/features/matches/scoring-engine.ts

import { MatchGame, PointValue, Side } from './types';

function otherSide(side: Side): Side {
  return side === 'player' ? 'opponent' : 'player';
}

const POINT_SEQUENCE: PointValue[] = [0, 15, 30, 40];

export interface PointResult {
  score: MatchGame['score'];
  winner: Side | null;
}

/**
 * Applies a single point win to a standard (non-tiebreak) game's
 * current score, handling deuce and advantage correctly. Returns
 * the new score and, if the point won the game outright, the
 * winner. Does not mutate the input game.
 */
export function awardPoint(game: MatchGame, winner: Side): PointResult {
  const loser = otherSide(winner);
  const winnerScore = game.score[winner];
  const loserScore = game.score[loser];

  if (winnerScore === 'Adv') {
    return { score: game.score, winner };
  }

  if (winnerScore === 40 && loserScore === 40) {
    return { score: { ...game.score, [winner]: 'Adv' }, winner: null };
  }

  if (loserScore === 'Adv') {
    return { score: { ...game.score, [loser]: 40 }, winner: null };
  }

  if (winnerScore === 40) {
    return { score: game.score, winner };
  }

  const currentIndex = POINT_SEQUENCE.indexOf(winnerScore);
  const nextScore = POINT_SEQUENCE[currentIndex + 1] ?? 40;
  return { score: { ...game.score, [winner]: nextScore }, winner: null };
}

export interface TiebreakPointResult {
  tiebreakScore: { player: number; opponent: number };
  winner: Side | null;
}

/**
 * Applies a single point win to a tiebreak game's score. Tiebreaks
 * are won by the first side to reach 7 points with a lead of at
 * least 2 (e.g. 7-5, or continuing past 7 if tied, like 9-7).
 * Does not mutate the input game.
 */
export function awardTiebreakPoint(game: MatchGame, winner: Side): TiebreakPointResult {
  const current = game.tiebreakScore ?? { player: 0, opponent: 0 };
  const loser = otherSide(winner);
  const updated = { ...current, [winner]: current[winner] + 1 };

  const wonTiebreak = updated[winner] >= 7 && updated[winner] - updated[loser] >= 2;

  return { tiebreakScore: updated, winner: wonTiebreak ? winner : null };
}