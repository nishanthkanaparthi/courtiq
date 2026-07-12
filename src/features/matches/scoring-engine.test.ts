// src/features/matches/scoring-engine.test.ts

import { createGame } from './types';
import { awardPoint } from './scoring-engine';

describe('awardPoint', () => {
  it('progresses player from 0 to 15 on first point won', () => {
    const game = createGame(1);
    const result = awardPoint(game, 'player');

    expect(result.score.player).toBe(15);
    expect(result.winner).toBeNull();
  });

  it('moves to deuce when both players reach 40', () => {
    let game = createGame(1);
    game = { ...game, score: { player: 40, opponent: 40 } };

    const result = awardPoint(game, 'player');

    expect(result.score.player).toBe('Adv');
    expect(result.winner).toBeNull();
  });

  it('wins the game when the player scores from advantage', () => {
    let game = createGame(1);
    game = { ...game, score: { player: 'Adv', opponent: 40 } };

    const result = awardPoint(game, 'player');

    expect(result.winner).toBe('player');
  });

  it('returns to deuce when the opponent cancels the players advantage', () => {
    let game = createGame(1);
    game = { ...game, score: { player: 'Adv', opponent: 40 } };

    const result = awardPoint(game, 'opponent');

    expect(result.score.player).toBe(40);
    expect(result.score.opponent).toBe(40);
    expect(result.winner).toBeNull();
  });

  it('wins the game outright from 40 against a non-deuce score', () => {
    let game = createGame(1);
    game = { ...game, score: { player: 40, opponent: 15 } };

    const result = awardPoint(game, 'player');

    expect(result.winner).toBe('player');
  });
});