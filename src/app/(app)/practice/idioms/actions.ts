"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";

export async function completeIdiom(correct: boolean) {
  const user = await requireUser();
  await recordActivity(user.id, correct ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await updateSkillScore(user.id, "VOCABULARY", correct ? 100 : 20);
  await awardAchievement(user.id, "first_idiom");
}
