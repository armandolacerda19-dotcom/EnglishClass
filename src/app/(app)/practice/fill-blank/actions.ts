"use server";

import { requireUser } from "@/lib/session";
import { getFillBlankItem } from "@/content/fillBlank";
import { semanticGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

// Preencher Espaços — correção semântica tolerante (a mesma frase pode ter
// mais do que uma forma aceitável, sobretudo nos espaços de expressão
// completa, não só palavra única).
export async function submitFillBlank(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getFillBlankItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = await semanticGrade(item.sentence, item.correct, given, user.id);

  await recordExerciseResult({
    userId: user.id,
    pillar: "GRAMMAR",
    kind: "fill_blank",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_fill_blank",
  });

  return { ...result, explanation: item.explanation };
}
