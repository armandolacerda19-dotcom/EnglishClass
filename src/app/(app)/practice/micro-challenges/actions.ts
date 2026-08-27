"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import type { Pillar } from "@prisma/client";

// Micro-desafios dão XP leve mas não criam um AssessmentResult DAILY — o checkpoint
// diário formal continua a ser o Desafio Diário de vocabulário (ver docs/decisions.md).
// pillar/score: antes não alimentavam o octógono de competência (mesma classe de gap
// já corrigida no AI Tutor) — "shadow" não tem correção formal, por isso usa um score
// de engagement moderado (65); "listen" usa a correção real (100/20).
export async function completeMicroChallenge(pillar: Pillar, score: number) {
  const user = await requireUser();
  await recordActivity(user.id, "MICRO_CHALLENGE");
  await updateSkillScore(user.id, pillar, score);
}
