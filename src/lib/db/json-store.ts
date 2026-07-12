import fs from 'fs/promises';
import path from 'path';
import { Match } from '@/features/matches/types';

const DB_PATH = path.join(process.cwd(), 'data', 'matches.json');

async function ensureFileExists(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function readMatches(): Promise<Match[]> {
  await ensureFileExists();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as Match[];
}

export async function writeMatches(matches: Match[]): Promise<void> {
  await ensureFileExists();
  await fs.writeFile(DB_PATH, JSON.stringify(matches, null, 2), 'utf-8');
}