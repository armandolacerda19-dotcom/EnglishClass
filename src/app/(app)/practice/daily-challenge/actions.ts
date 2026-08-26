"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/gamification/recordActivity";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
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

  return { alreadyDoneToday: false };
}
