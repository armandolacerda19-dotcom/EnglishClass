"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { scheduleReview, type ReviewItemType } from "@/lib/srs/schedule";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";

// Converte a auto-avaliação estilo Anki (1/3/5) num score 0-100 para o octógono
// de competência — a mesma escala usada nos outros pontos de captura de sinal.
function qualityToScore(quality: number): number {
  if (quality >= 5) return 100;
  if (quality >= 3) return 60;
  return 20;
}

// Auto-avaliação estilo Anki: 1 = não sabia, 3 = custou, 5 = sabia bem.
// Alimenta o SM-2 (src/lib/srs/sm2.ts) para decidir quando o item volta a aparecer.
export async function submitReview(
  itemType: ReviewItemType,
  itemRefId: string,
  quality: number,
  userErrorId?: string
) {
  const user = await requireUser();
  await scheduleReview(user.id, itemType, itemRefId, quality, userErrorId);
  await recordActivity(user.id, "REVIEW");

  if (itemType === "vocabulary_item") {
    await updateSkillScore(user.id, "VOCABULARY", qualityToScore(quality));
  } else if (userErrorId) {
    const userError = await prisma.userError.findUnique({ where: { id: userErrorId } });
    if (userError) await updateSkillScore(user.id, userError.pillar, qualityToScore(quality));
  }
}
