"use server";

import { requireUser } from "@/lib/session";
import { getContextWordChoiceItem } from "@/content/contextWordChoice";
import { exactMatchGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

// Escolher pela Palavra Certa (contexto) — 3º tipo de exercício novo sobre o
// Exercise Engine.
export async function submitContextWordChoice(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getContextWordChoiceItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = exactMatchGrade(given, item.correct);

  await recordExerciseResult({
    userId: user.id,
    pillar: "VOCABULARY",
    kind: "context_word_choice",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_context_choice",
  });

  return result;
}
