import { prisma } from "@/lib/prisma";

// Desafio Diário de vocabulário — pedido do utilizador (2026-08-26), ver PROJECT_STATE.md.
// Seleção determinística por dia (mesma palavra para todos os utilizadores no mesmo dia),
// sem depender de Math.random() para ser reproduzível se a página for recarregada.

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

export interface DailyChallengeWord {
  id: string;
  headword: string;
  translationPt: string;
  definitionEn: string;
  exampleSentences: string[];
  options: string[]; // 4 opções de tradução (incl. a correta), já baralhadas
}

const CHALLENGE_SIZE_MIN = 5;
const CHALLENGE_SIZE_MAX = 10;

export async function getDailyChallenge(date: Date = new Date()): Promise<DailyChallengeWord[]> {
  const allWords = await prisma.vocabularyItem.findMany({ orderBy: { id: "asc" } });
  if (allWords.length === 0) return [];

  const seed = dailySeed(date);
  const size = Math.max(CHALLENGE_SIZE_MIN, Math.min(CHALLENGE_SIZE_MAX, allWords.length));
  const selected = seededShuffle(allWords, seed).slice(0, Math.min(size, allWords.length));

  return selected.map((word, i) => {
    const distractorPool = allWords.filter((w) => w.id !== word.id).map((w) => w.translationPt);
    const distractors = seededShuffle(distractorPool, seed + i * 97 + 1).slice(0, 3);
    const options = seededShuffle([word.translationPt, ...distractors], seed + i * 233 + 7);
    return {
      id: word.id,
      headword: word.headword,
      translationPt: word.translationPt,
      definitionEn: word.definitionEn,
      exampleSentences: word.exampleSentences,
      options,
    };
  });
}

// 3 frases de exemplo para praticar as palavras do desafio de hoje — uma por palavra,
// até 3, priorizando palavras com frase de exemplo disponível.
export function pickPracticeSentences(words: DailyChallengeWord[], count = 3): { sentence: string; headword: string }[] {
  const withSentences = words.filter((w) => w.exampleSentences.length > 0);
  return withSentences.slice(0, count).map((w) => ({ sentence: w.exampleSentences[0]!, headword: w.headword }));
}
