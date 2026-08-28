"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { checkOrdering } from "@/lib/sentenceOrdering";
import { getOrderingItem } from "@/content/sentenceOrdering";

// Mesmo padrão de segurança de submitDictation (Fase 8, auditoria
// 2026-08-27): o cliente envia só a sequência que montou (id da frase +
// array de palavras na ordem que o utilizador escolheu) — a correção é
// sempre recalculada aqui contra `ORDERING_ITEMS` (content/sentenceOrdering.ts),
// nunca aceite como um booleano já decidido pelo cliente. Um pedido direto
// `submitOrdering([{itemId: "o-01", given: ["qualquer","coisa"]}])` é
// corrigido com o mesmo rigor que um pedido genuíno.
export async function submitOrdering(answers: { itemId: string; given: string[] }[]) {
  const user = await requireUser();

  const total = answers.length;
  const correct = answers.filter((a) => {
    const item = getOrderingItem(a.itemId);
    return item ? checkOrdering(a.given, item) : false;
  }).length;

  if (total > 0) {
    await updateSkillScore(user.id, "GRAMMAR", Math.round((correct / total) * 100));
  }
  await recordActivity(user.id, correct === total ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await awardAchievement(user.id, "first_ordering");

  return { correct, total };
}
