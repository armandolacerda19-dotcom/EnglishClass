import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { scheduleReview } from "@/lib/srs/schedule";
import type { ExerciseResultInput } from "./types";

// Exercise Engine — ponto único onde um exercício NOVO regista o resultado.
// Chama sempre as mesmas 4 funções já existentes e verificadas
// (updateSkillScore/recordActivity/awardAchievement/scheduleReview) na mesma
// ordem e com a mesma lógica de erro que `submitExerciseAnswer` já usa em
// learn/actions.ts — nunca reimplementa nada delas. Isto existe só para que
// cada Server Action de um tipo de exercício novo não tenha de repetir estas
// 4-5 chamadas à mão (o que já acontecia, ligeiramente diferente, em 11+
// ficheiros de actions.ts espalhados pela app).
export async function recordExerciseResult(input: ExerciseResultInput): Promise<void> {
  const { userId, pillar, score, correct, errorSignal, achievementCode } = input;

  await updateSkillScore(userId, pillar, score);
  await recordActivity(userId, correct ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  if (achievementCode) await awardAchievement(userId, achievementCode);

  if (!correct && errorSignal) {
    const existingError = await prisma.userError.findFirst({
      where: { userId, errorType: errorSignal.errorType, resolvedAt: null },
    });

    const userError = existingError
      ? await prisma.userError.update({
          where: { id: existingError.id },
          data: { occurrences: { increment: 1 }, lastOccurredAt: new Date(), sourceText: errorSignal.sourceText },
        })
      : await prisma.userError.create({
          data: {
            userId,
            pillar,
            errorType: errorSignal.errorType,
            commonMistakePt: errorSignal.commonMistakePt,
            sourceText: errorSignal.sourceText,
            correction: errorSignal.correction,
          },
        });

    await scheduleReview(userId, "error", userError.id, 1, userError.id);
  }
}
