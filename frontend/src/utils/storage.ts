import type { ProfileStats } from '../types';

const STORAGE_KEY = 'shykey:v1';

export function loadStats(fallback: ProfileStats): ProfileStats {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return fallback;

    const parsed: unknown = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object') return fallback;
    const value = parsed as Partial<ProfileStats>;
    if (
      typeof value.streak !== 'number' || !Number.isInteger(value.streak) || value.streak < 0
      || typeof value.reps !== 'number' || !Number.isInteger(value.reps) || value.reps < 0
      || typeof value.best !== 'number' || !Number.isInteger(value.best) || value.best < 0
      || !(typeof value.date === 'string' || value.date === null)
    ) return fallback;

    return { streak: value.streak, reps: value.reps, best: value.best, date: value.date };
  } catch {
    return fallback;
  }
}

export function saveStats(stats: ProfileStats): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // Local storage can be unavailable in private browsing; the in-memory demo still works.
  }
}

export function clearStats(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Resetting the in-memory demo still works when local storage is unavailable.
  }
}
