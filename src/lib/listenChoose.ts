import { LISTEN_CHOOSE_ITEMS, type ListenChooseItem } from "@/content/listenChoose";

// Velocidade por omissão do PlayTranscript por camada — Iniciante começa
// devagar e claro, Intermédio/Avançado em velocidade natural (o utilizador
// pode sempre ajustar manualmente, isto só muda o ponto de partida).
export const TIER_DEFAULT_SPEED: Record<ListenChooseItem["tier"], number> = {
  beginner: 0.75,
  intermediate: 1,
  advanced: 1,
};

export const TIER_LABEL: Record<ListenChooseItem["tier"], string> = {
  beginner: "Iniciante",
  intermediate: "Intermédio",
  advanced: "Avançado",
};

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

export function getListenChooseSet(tier: ListenChooseItem["tier"], date: Date = new Date()): ListenChooseItem[] {
  const key = `${date.toISOString().slice(0, 10)}:${tier}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const pool = LISTEN_CHOOSE_ITEMS.filter((l) => l.tier === tier);
  return seededShuffle(pool, hash);
}
