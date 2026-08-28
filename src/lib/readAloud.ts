import { READ_ALOUD_ITEMS, type ReadAloudItem } from "@/content/readAloud";

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

const SET_SIZE = 4;

export function getDailyReadAloudSet(date: Date = new Date()): ReadAloudItem[] {
  const seed = dailySeed(date);
  return seededShuffle(READ_ALOUD_ITEMS, seed).slice(0, Math.min(SET_SIZE, READ_ALOUD_ITEMS.length));
}

export interface ReadAloudWordDiff {
  word: string;
  correct: boolean;
}

export interface ReadAloudAnalysis {
  accuracy: number; // 0-100, precisão real palavra a palavra
  diff: ReadAloudWordDiff[];
  omittedWords: string[];
  wpm: number | null; // null se durationMs não for válido
  fluencyScore: number | null; // 0-100, baseado no ritmo (velocidade real de leitura), null se sem duração
}

function normalize(text: string): string {
  return text.toLowerCase().replace(/[.,!?;:"]/g, "").replace(/\s+/g, " ").trim();
}

// Ritmo de leitura natural em voz alta para um adulto: ~110-170
// palavras/minuto. Fora desse intervalo (muito lento = hesitante, muito
// rápido é raro de acontecer por acidente) a pontuação reflete isso — nunca
// finge medir "fluência" a sério sem qualquer dado de tempo real por trás.
const NATURAL_WPM_TARGET = 140;

export function analyzeReadAloud(transcript: string, target: string, durationMs: number | null): ReadAloudAnalysis {
  const givenWords = normalize(transcript).split(" ").filter(Boolean);
  const targetWords = normalize(target).split(" ").filter(Boolean);

  const diff: ReadAloudWordDiff[] = targetWords.map((word, i) => ({ word, correct: givenWords[i] === word }));
  const matches = diff.filter((d) => d.correct).length;
  const accuracy = targetWords.length > 0 ? Math.round((matches / targetWords.length) * 100) : 0;
  const omittedWords = diff.filter((d) => !d.correct).map((d) => d.word);

  let wpm: number | null = null;
  let fluencyScore: number | null = null;
  if (durationMs && durationMs > 0 && givenWords.length > 0) {
    wpm = Math.round((givenWords.length / (durationMs / 1000)) * 60);
    fluencyScore = Math.max(20, Math.min(100, Math.round((wpm / NATURAL_WPM_TARGET) * 100)));
  }

  return { accuracy, diff, omittedWords, wpm, fluencyScore };
}
