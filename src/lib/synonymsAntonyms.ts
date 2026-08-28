import { SYNONYM_ANTONYM_ITEMS, type SynonymAntonymItem } from "@/content/synonymsAntonyms";

function dailySeed(date: Date) {
  const key = date.toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

const SET_SIZE = 6;

export function getDailySynonymAntonymSet(date: Date = new Date()): SynonymAntonymItem[] {
  const seed = dailySeed(date);
  return seededShuffle(SYNONYM_ANTONYM_ITEMS, seed).slice(0, Math.min(SET_SIZE, SYNONYM_ANTONYM_ITEMS.length));
}
