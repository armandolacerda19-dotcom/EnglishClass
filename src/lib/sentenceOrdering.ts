import { ORDERING_ITEMS, type OrderingItem } from "@/content/sentenceOrdering";

// Mesmo padrão de seleção determinística por dia de src/lib/dictation.ts —
// hash da data, sem Math.random(), sem BD: frases diferentes a cada dia,
// iguais para todos os utilizadores nesse dia, reproduzíveis se a página
// recarregar (incluindo a ordem baralhada das palavras dentro de cada frase).

function dailySeed(key: string) {
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

export function seededShuffle<T>(items: T[], seed: number): T[] {
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

export function getDailyOrderingSet(date: Date = new Date()): OrderingItem[] {
  const dateKey = date.toISOString().slice(0, 10);
  const seed = dailySeed(dateKey);
  return seededShuffle(ORDERING_ITEMS, seed).slice(0, Math.min(SET_SIZE, ORDERING_ITEMS.length));
}

// Baralha as palavras de UM item de forma estável para o dia — se o
// utilizador recarregar a página a meio, a ordem baralhada não muda (o que
// seria confuso, parecendo que a pergunta "mudou"), mas amanhã é diferente.
export function shuffleWords(item: OrderingItem, date: Date = new Date()): string[] {
  const dateKey = date.toISOString().slice(0, 10);
  const seed = dailySeed(`${dateKey}:${item.id}`);
  // Garante que a ordem baralhada nunca é, por acaso, igual à ordem certa
  // (mais provável em frases curtas de 3-4 palavras) — sem isto, de vez em
  // quando o exercício "começava resolvido".
  let shuffled = seededShuffle(item.words, seed);
  let attempt = seed;
  while (item.words.length > 1 && shuffled.join(" ") === item.words.join(" ")) {
    attempt = (attempt * 1664525 + 1013904223) >>> 0;
    shuffled = seededShuffle(item.words, attempt);
  }
  return shuffled;
}

export function checkOrdering(given: string[], item: OrderingItem): boolean {
  if (given.length !== item.words.length) return false;
  return given.every((w, i) => w === item.words[i]);
}
