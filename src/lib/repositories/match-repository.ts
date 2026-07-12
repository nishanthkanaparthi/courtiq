import { Match } from '@/features/matches/types';
import { readMatches, writeMatches } from '@/lib/db/json-store';

export interface MatchRepository {
  findById(id: string): Promise<Match | null>;
  findByPlayerId(playerId: string): Promise<Match[]>;
  save(match: Match): Promise<void>;
}

export class JsonMatchRepository implements MatchRepository {
  async findById(id: string): Promise<Match | null> {
    const matches = await readMatches();
    return matches.find((m) => m.id === id) ?? null;
  }

  async findByPlayerId(playerId: string): Promise<Match[]> {
    const matches = await readMatches();
    return matches.filter((m) => m.playerId === playerId);
  }

  async save(match: Match): Promise<void> {
    const matches = await readMatches();
    const index = matches.findIndex((m) => m.id === match.id);
    if (index >= 0) {
      matches[index] = match;
    } else {
      matches.push(match);
    }
    await writeMatches(matches);
  }
}