// src/lib/db/stats-store.ts

import fs from 'fs/promises';
import path from 'path';
import { StatEntry } from '@/features/stats/types';

const DB_PATH = path.join(process.cwd(), 'data', 'stats.json');

async function ensureFileExists(): Promise<void> {
  try {
    await fs.access(DB_PATH);
  } catch {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function readStatEntries(): Promise<StatEntry[]> {
  await ensureFileExists();
  const raw = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw) as StatEntry[];
}

export async function writeStatEntries(entries: StatEntry[]): Promise<void> {
  await ensureFileExists();
  await fs.writeFile(DB_PATH, JSON.stringify(entries, null, 2), 'utf-8');
}