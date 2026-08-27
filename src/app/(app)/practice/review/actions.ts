"use server";

import { requireUser } from "@/lib/session";
import { scheduleReview, type ReviewItemType } from "@/lib/srs/schedule";
import { recordActivity } from "@/lib/gamification/recordActivity";

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
}
