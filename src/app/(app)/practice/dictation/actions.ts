"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";

export async function submitDictation(correct: number, total: number) {
  const user = await requireUser();

  if (total > 0) {
    await updateSkillScore(user.id, "LISTENING", Math.round((correct / total) * 100));
  }
  await recordActivity(user.id, correct === total ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await awardAchievement(user.id, "first_dictation");
}
