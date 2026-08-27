"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import { awardAchievement } from "@/lib/gamification/awardAchievement";

export async function completeVerbOfTheDay(knewIt: boolean) {
  const user = await requireUser();
  await recordActivity(user.id, knewIt ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await updateSkillScore(user.id, "GRAMMAR", knewIt ? 100 : 20);
  await awardAchievement(user.id, "first_verb");
}
