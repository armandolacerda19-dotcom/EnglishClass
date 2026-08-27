"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { scheduleReview } from "@/lib/srs/schedule";
import { updateSkillScore } from "@/lib/skillProfile";
import { awardAchievement } from "@/lib/gamification/awardAchievement";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

// Chamado a cada palavra respondida no Desafio Diário — agenda a próxima revisão
// via SM-2 (src/lib/srs/sm2.ts). quality 5 = acertou, 1 = falhou.
export async function recordVocabExposure(vocabularyItemId: string, correct: boolean) {
  const user = await requireUser();
  await scheduleReview(user.id, "vocabulary_item", vocabularyItemId, correct ? 5 : 1);
  await updateSkillScore(user.id, "VOCABULARY", correct ? 100 : 20);
}

// Checkpoint diário (docs/05-avaliacao-certificacao.md) — completar o Desafio Diário
// de vocabulário conta como o checkpoint do dia. Só a primeira conclusão do dia dá XP,
// para não incentivar repetir só para "farmar" pontos.
export async function completeDailyChallenge(score: number, total: number) {
  const user = await requireUser();
  const todayStart = startOfDay(new Date());

  const existing = await prisma.assessmentResult.findFirst({
    where: { userId: user.id, type: "DAILY", createdAt: { gte: todayStart } },
  });

  if (existing) {
    return { alreadyDoneToday: true };
  }

  await prisma.assessmentResult.create({
    data: {
      userId: user.id,
      type: "DAILY",
      scoreJson: { kind: "vocabulary_challenge", score, total },
      passed: total > 0 && score === total,
    },
  });
  await recordActivity(user.id, "DAILY_CHALLENGE");
  await awardAchievement(user.id, "first_daily_challenge");

  return { alreadyDoneToday: false };
}
