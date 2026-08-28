"use server";

import { requireUser } from "@/lib/session";
import { getTranslationEnPtItem } from "@/content/translationEnPt";
import { semanticGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

// Tradução EN→PT — completa o par com a direção PT→EN já existente
// (TranslationStep). Mesma correção semântica tolerante (`semanticGrade`,
// nunca igualdade exata) — há sempre mais do que uma forma válida de
// traduzir a mesma frase.
export async function submitTranslationEnPt(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getTranslationEnPtItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = await semanticGrade(item.sentence, item.correctPt, given, user.id);

  await recordExerciseResult({
    userId: user.id,
    pillar: "TRANSLATION",
    kind: "translation_en_pt",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_translation_en_pt",
  });

  return result;
}
