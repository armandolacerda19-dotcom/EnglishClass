"use server";

import { requireUser } from "@/lib/session";
import { getListenChooseItem } from "@/content/listenChoose";
import { exactMatchGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import type { GradingResult } from "@/lib/exercise/types";

export async function submitListenChoose(itemId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const item = getListenChooseItem(itemId);
  if (!item) return { isCorrect: false, score: 0 };

  const result = exactMatchGrade(given, item.correct);

  await recordExerciseResult({
    userId: user.id,
    pillar: "LISTENING",
    kind: "listen_and_choose",
    score: result.score,
    correct: result.isCorrect === true,
    achievementCode: "first_listen_choose",
  });

  return result;
}
