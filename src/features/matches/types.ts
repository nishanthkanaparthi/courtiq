// src/features/matches/types.ts

export type Side = 'player' | 'opponent';

export type PointValue = 0 | 15 | 30 | 40 | 'Adv';

export type MatchFormat = 'best-of-3';

export type MatchStatus = 'in-progress' | 'completed' | 'abandoned';

export interface MatchPoint {
  id: string;
  pointNumber: number;
  winner: Side;
  timestamp: string;
}

export interface MatchGame {
  id: string;
  gameNumber: number;
  points: MatchPoint[];
  score: { player: PointValue; opponent: PointValue };
  tiebreakScore?: { player: number; opponent: number };
  winner: Side | null;
  isTiebreak: boolean;
}

export interface MatchSet {
  id: string;
  setNumber: number;
  games: MatchGame[];
  playerGamesWon: number;
  opponentGamesWon: number;
  winner: Side | null;
}

export interface Match {
  id: string;
  playerId: string;
  opponentName: string;
  format: MatchFormat;
  status: MatchStatus;
  startedAt: string;
  completedAt: string | null;
  sets: MatchSet[];
  currentSetIndex: number;
  currentGameIndex: number;
  winner: Side | null;
}

export function createMatch(playerId: string, opponentName: string): Match {
  return {
    id: crypto.randomUUID(),
    playerId,
    opponentName,
    format: 'best-of-3',
    status: 'in-progress',
    startedAt: new Date().toISOString(),
    completedAt: null,
    sets: [createSet(1)],
    currentSetIndex: 0,
    currentGameIndex: 0,
    winner: null,
  };
}

export function createSet(setNumber: number): MatchSet {
  return {
    id: crypto.randomUUID(),
    setNumber,
    games: [createGame(1)],
    playerGamesWon: 0,
    opponentGamesWon: 0,
    winner: null,
  };
}

export function createGame(gameNumber: number): MatchGame {
  return {
    id: crypto.randomUUID(),
    gameNumber,
    points: [],
    score: { player: 0, opponent: 0 },
    winner: null,
    isTiebreak: false,
  };
}

export function createTiebreakGame(gameNumber: number): MatchGame {
  return {
    id: crypto.randomUUID(),
    gameNumber,
    points: [],
    score: { player: 0, opponent: 0 },
    tiebreakScore: { player: 0, opponent: 0 },
    winner: null,
    isTiebreak: true,
  };
}

export function formatFinalScore(match: Match): string {
  return match.sets
    .filter((set) => set.winner !== null)
    .map((set) => `${set.playerGamesWon}-${set.opponentGamesWon}`)
    .join(', ');
}