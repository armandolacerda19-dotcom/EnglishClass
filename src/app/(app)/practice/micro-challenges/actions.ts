"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";

// Micro-desafios dão XP leve mas não criam um AssessmentResult DAILY — o checkpoint
// diário formal continua a ser o Desafio Diário de vocabulário (ver docs/decisions.md).
export async function completeMicroChallenge() {
  const user = await requireUser();
  await recordActivity(user.id, "MICRO_CHALLENGE");
}
