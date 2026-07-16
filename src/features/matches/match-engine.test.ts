// src/features/matches/match-engine.test.ts

import { createMatch } from './types';
import { Match, Side } from './types';
import { recordPoint, abandonMatch } from './match-engine';

function winGame(match: Match, winner: Side): Match {
  let updated = match;
  for (let i = 0; i < 4; i++) {
    updated = recordPoint(updated, winner);
  }
  return updated;
}

describe('recordPoint', () => {
  it('wins a set 6-4', () => {
    let match = createMatch('player-1', 'Test Opponent');
    for (let i = 0; i < 4; i++) match = winGame(match, 'opponent');
    for (let i = 0; i < 6; i++) match = winGame(match, 'player');

    expect(match.sets[0].winner).toBe('player');
    expect(match.sets[0].playerGamesWon).toBe(6);
    expect(match.sets[0].opponentGamesWon).toBe(4);
    expect(match.status).toBe('in-progress');
    expect(match.sets.length).toBe(2);
    expect(match.currentSetIndex).toBe(1);
  });

  it('triggers a tiebreak game at 6-6', () => {
    let match = createMatch('player-1', 'Test Opponent');
    for (let i = 0; i < 6; i++) {
      match = winGame(match, 'player');
      match = winGame(match, 'opponent');
    }

    const currentSet = match.sets[match.currentSetIndex];
    const currentGame = currentSet.games[match.currentGameIndex];

    expect(currentSet.playerGamesWon).toBe(6);
    expect(currentSet.opponentGamesWon).toBe(6);
    expect(currentGame.isTiebreak).toBe(true);
  });

  it('wins the set via tiebreak 7-6', () => {
    let match = createMatch('player-1', 'Test Opponent');
    for (let i = 0; i < 6; i++) {
      match = winGame(match, 'player');
      match = winGame(match, 'opponent');
    }

    for (let i = 0; i < 7; i++) {
      match = recordPoint(match, 'player');
    }

    expect(match.sets[0].winner).toBe('player');
    expect(match.sets[0].playerGamesWon).toBe(7);
    expect(match.sets[0].opponentGamesWon).toBe(6);
  });

  it('completes the match after winning two sets', () => {
    let match = createMatch('player-1', 'Test Opponent');
    for (let i = 0; i < 6; i++) match = winGame(match, 'player');
    for (let i = 0; i < 6; i++) match = winGame(match, 'player');

    expect(match.status).toBe('completed');
    expect(match.winner).toBe('player');
    expect(match.completedAt).not.toBeNull();
    expect(match.sets.length).toBe(2);
  });

  it('starts a third set when sets are split 1-1', () => {
    let match = createMatch('player-1', 'Test Opponent');
    for (let i = 0; i < 6; i++) match = winGame(match, 'player');
    for (let i = 0; i < 6; i++) match = winGame(match, 'opponent');

    expect(match.status).toBe('in-progress');
    expect(match.sets.length).toBe(3);
    expect(match.currentSetIndex).toBe(2);
  });
});

describe('abandonMatch', () => {
  it('marks an in-progress match as abandoned', () => {
    const match = createMatch('player-1', 'Test Opponent');

    const abandoned = abandonMatch(match);

    expect(abandoned.status).toBe('abandoned');
    expect(abandoned.completedAt).not.toBeNull();
    expect(abandoned.winner).toBeNull();
  });

  it('does not change a match that is already completed', () => {
    let match = createMatch('player-1', 'Test Opponent');
    for (let i = 0; i < 6; i++) match = winGame(match, 'player');
    for (let i = 0; i < 6; i++) match = winGame(match, 'player');

    expect(match.status).toBe('completed');

    const result = abandonMatch(match);

    expect(result).toEqual(match);
    expect(result.status).toBe('completed');
  });
});