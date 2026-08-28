"use server";

import { requireUser } from "@/lib/session";
import { getReadAloudItem } from "@/content/readAloud";
import { analyzeReadAloud, type ReadAloudAnalysis } from "@/lib/readAloud";
import { recordExerciseResult } from "@/lib/exercise/progress";

// Leitura em Voz Alta — o servidor lê o texto real por id e recalcula a
// análise a partir do transcript+duração enviados, nunca aceita uma nota já
// calculada. `durationMs` é, por natureza, medido no cliente (não há forma
// de o servidor cronometrar uma gravação que corre inteiramente no browser)
// — mesmo padrão já aceite para `responseTimeMs` em submitSpeaking
// (learn/actions.ts): um sinal de engajamento, não uma prova de segurança
// central, com um tecto para nunca corromper métricas com valores absurdos.
export async function submitReadAloud(itemId: string, transcript: string, durationMs: number | null): Promise<ReadAloudAnalysis> {
  const user = await requireUser();
  const item = getReadAloudItem(itemId);
  if (!item) return { accuracy: 0, diff: [], omittedWords: [], wpm: null, fluencyScore: null };

  const safeDuration =
    typeof durationMs === "number" && Number.isFinite(durationMs) && durationMs > 0 ? Math.min(durationMs, 2 * 60 * 1000) : null;

  const analysis = analyzeReadAloud(transcript, item.text, safeDuration);

  await recordExerciseResult({
    userId: user.id,
    pillar: "PRONUNCIATION",
    kind: "read_aloud",
    score: analysis.accuracy,
    correct: analysis.accuracy >= 80,
    achievementCode: "first_read_aloud",
  });

  return analysis;
}
