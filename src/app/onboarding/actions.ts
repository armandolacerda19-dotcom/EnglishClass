"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Goal, LearningTrack, EnglishVariant } from "@prisma/client";

export interface OnboardingBasics {
  goal: Goal;
  dailyMinutes: number;
  profession: string;
  interests: string[];
  englishVariant: EnglishVariant;
  track: LearningTrack;
  targetDate: string | null; // ISO, só para Intensive
}

// Guarda a primeira metade do onboarding (objetivo, tempo, perfil, percurso).
// O nível CEFR só é definido depois do placement test (ver /onboarding/placement).
export async function saveOnboardingBasics(basics: OnboardingBasics) {
  const user = await requireUser();

  await prisma.learningProfile.upsert({
    where: { userId: user.id },
    update: {
      goal: basics.goal,
      dailyMinutesTarget: basics.dailyMinutes,
      profession: basics.profession,
      interests: basics.interests,
      englishVariant: basics.englishVariant,
      track: basics.track,
      targetDate: basics.targetDate ? new Date(basics.targetDate) : null,
    },
    create: {
      userId: user.id,
      goal: basics.goal,
      dailyMinutesTarget: basics.dailyMinutes,
      profession: basics.profession,
      interests: basics.interests,
      englishVariant: basics.englishVariant,
      track: basics.track,
      targetDate: basics.targetDate ? new Date(basics.targetDate) : null,
    },
  });

  redirect("/onboarding/placement");
}
