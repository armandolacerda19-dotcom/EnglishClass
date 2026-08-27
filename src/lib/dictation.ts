import { DICTATION_ITEMS, type DictationItem } from "@/content/dictation";

// Mesmo padrão de seleção determinística por dia de src/lib/dailyChallenge.ts
// (hash da data, sem Math.random()) — mas síncrono e sem BD, porque o ditado
// é conteúdo estático. Frases diferentes a cada dia, iguais para todos os
// utilizadores nesse dia, reproduzíveis se a página recarregar.

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

const SET_SIZE = 5;

export function getDailyDictationSet(date: Date = new Date()): DictationItem[] {
  const seed = dailySeed(date);
  return seededShuffle(DICTATION_ITEMS, seed).slice(0, Math.min(SET_SIZE, DICTATION_ITEMS.length));
}

// Compara o que o utilizador escreveu com a frase original: ignora
// maiúsculas/minúsculas, pontuação (exceto apóstrofos, que distinguem
// contrações como "doesn't"/"does not") e espaços a mais.
function normalize(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,!?;:"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export interface DictationWordDiff {
  word: string;
  correct: boolean;
}

export function checkDictation(given: string, original: string): { isCorrect: boolean; diff: DictationWordDiff[] } {
  const isCorrect = normalize(given) === normalize(original);
  const givenWords = normalize(given).split(" ").filter(Boolean);
  const originalWords = normalize(original).split(" ").filter(Boolean);
  const diff: DictationWordDiff[] = originalWords.map((word, i) => ({
    word,
    correct: givenWords[i] === word,
  }));
  return { isCorrect, diff };
}
