"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";

const MAX_ITEMS = 12; // o round nunca mostra mais do que SET_SIZE (6) — folga generosa

// Emparelhar: a UI só deixa um par avançar quando é correto (tentativas
// erradas voltam a separar-se) — por isso, ao contrário de outros
// exercícios, "quantos pares certos" não é o sinal a proteger (chegar ao fim
// implica sempre tê-los acertado todos, mesma confiança de "quantos itens
// tentei" já aceite em dictation/ordering). O que fica é validar que
// `itemIds` são mesmo `VocabularyItem` reais — sem isto, um pedido direto
// com ids inventados passava na mesma. O nº de erros entra na nota:
// menos tentativas erradas = nota mais alta.
export async function submitMatching(itemIds: string[], mistakes: number) {
  const user = await requireUser();

  const safeIds = Array.isArray(itemIds) ? itemIds.slice(0, MAX_ITEMS).filter((id) => typeof id === "string") : [];
  const safeMistakes = Number.isFinite(mistakes) ? Math.max(0, Math.min(50, Math.round(mistakes))) : 0;

  const realItems = await prisma.vocabularyItem.findMany({ where: { id: { in: safeIds } }, select: { id: true } });
  const completed = realItems.length;

  if (completed > 0) {
    const score = Math.max(30, 100 - safeMistakes * 10);
    await updateSkillScore(user.id, "VOCABULARY", score);
  }
  await recordActivity(user.id, safeMistakes === 0 ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await awardAchievement(user.id, "first_matching");

  return { completed, mistakes: safeMistakes };
}
