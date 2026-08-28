"use server";

import { requireUser } from "@/lib/session";
import { getWordBuilderItem } from "@/content/wordBuilder";
import { exactMatchGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

// Word Builder — construção/transformação de palavras (prefixos, sufixos,
// word families). Igualdade exata: a forma derivada correta é única
// (happiness, não "happynes" nem sinónimos).
export async function submitWordBuilder(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getWordBuilderItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = exactMatchGrade(given, item.correct);

  await recordExerciseResult({
    userId: user.id,
    pillar: "VOCABULARY",
    kind: "word_builder",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_word_builder",
  });

  return { ...result, explanation: item.rule };
}
