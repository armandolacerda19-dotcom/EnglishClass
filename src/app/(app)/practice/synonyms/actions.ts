"use server";

import { requireUser } from "@/lib/session";
import { getSynonymAntonymItem } from "@/content/synonymsAntonyms";
import { exactMatchGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

// Sinónimos e Antónimos — 2º tipo de exercício novo sobre o Exercise Engine.
// Servidor lê a resposta certa por id, nunca confia numa opção "correta" já
// marcada pelo cliente.
export async function submitSynonymAntonym(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getSynonymAntonymItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = exactMatchGrade(given, item.correct);

  await recordExerciseResult({
    userId: user.id,
    pillar: "VOCABULARY",
    kind: "synonym_antonym",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_synonym_antonym",
  });

  return result;
}
