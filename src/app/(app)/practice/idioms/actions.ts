"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { getIdiomOfTheDay } from "@/content/idioms";

// Fase 8 (auditoria 2026-08-27) — antes recebia `correct: boolean` já
// decidido pelo cliente. `getIdiomOfTheDay()` é determinístico por data
// (mesmo idioma para todos num dia, sem BD) — por isso o servidor consegue
// recalcular a correção sozinho, sem precisar de um id do cliente: chama a
// mesma função com a data de hoje e compara `selected` com `meaningEn`.
export async function completeIdiom(selected: string) {
  const user = await requireUser();
  const idiom = getIdiomOfTheDay();
  const correct = selected === idiom.meaningEn;

  await recordActivity(user.id, correct ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await updateSkillScore(user.id, "VOCABULARY", correct ? 100 : 20);
  await awardAchievement(user.id, "first_idiom");

  return { correct };
}
