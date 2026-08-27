"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { checkDictation } from "@/lib/dictation";
import { getDictationItem } from "@/content/dictation";

// Fase 8 (auditoria 2026-08-27) — antes recebia `correct`/`total` já
// calculados pelo cliente, uma Server Action pública que qualquer chamada
// direta (`submitDictation(999, 999)`) inflacionava sem limite. Corrigido:
// o cliente envia as respostas em bruto (id da frase + o que escreveu) e a
// correção é sempre recalculada aqui com `checkDictation` contra o texto
// real de `content/dictation.ts` — o mesmo conteúdo estático que o
// DictationRunner já usa no cliente, por isso o resultado nunca diverge
// para um utilizador honesto.
export async function submitDictation(answers: { itemId: string; given: string }[]) {
  const user = await requireUser();

  const total = answers.length;
  const correct = answers.filter((a) => {
    const item = getDictationItem(a.itemId);
    return item ? checkDictation(a.given, item.text).isCorrect : false;
  }).length;

  if (total > 0) {
    await updateSkillScore(user.id, "LISTENING", Math.round((correct / total) * 100));
  }
  await recordActivity(user.id, correct === total ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await awardAchievement(user.id, "first_dictation");

  return { correct, total };
}
