"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";

export interface WeeklyTestAnswer {
  exerciseId: string;
  pillar: Pillar;
  given: string;
}

export interface WeeklyTestResult {
  overallScore: number;
  breakdown: { pillar: Pillar; correct: number; total: number }[];
  weakAreas: string[];
}

// Corrige o Diagnóstico Semanal, atualiza o octógono de competência por pilar
// (src/lib/skillProfile.ts) e regista um AssessmentResult tipo WEEKLY — a mesma
// fonte de dados que já alimenta os checkpoints em /progress.
export async function submitWeeklyTest(answers: WeeklyTestAnswer[]): Promise<WeeklyTestResult> {
  const user = await requireUser();

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: answers.map((a) => a.exerciseId) } },
  });
  const byId = new Map(exercises.map((e) => [e.id, e]));

  const byPillar = new Map<Pillar, { correct: number; total: number }>();

  for (const answer of answers) {
    const exercise = byId.get(answer.exerciseId);
    if (!exercise) continue;
    const content = exercise.contentJson as any;
    const isCorrect = (content.correct_answer as string[]).some(
      (c) => c.trim().toLowerCase() === answer.given.trim().toLowerCase()
    );

    const bucket = byPillar.get(answer.pillar) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (isCorrect) bucket.correct += 1;
    byPillar.set(answer.pillar, bucket);
  }

  const breakdown = Array.from(byPillar.entries()).map(([pillar, b]) => ({ pillar, ...b }));
  const totalCorrect = breakdown.reduce((a, b) => a + b.correct, 0);
  const totalQuestions = breakdown.reduce((a, b) => a + b.total, 0);
  const overallScore = totalQuestions === 0 ? 0 : Math.round((totalCorrect / totalQuestions) * 100);

  for (const b of breakdown) {
    await updateSkillScore(user.id, b.pillar, b.total === 0 ? 0 : Math.round((b.correct / b.total) * 100));
  }

  await prisma.assessmentResult.create({
    data: {
      userId: user.id,
      type: "WEEKLY",
      scoreJson: { kind: "weekly_diagnostic", overallScore, breakdown },
      passed: overallScore >= 70,
    },
  });

  await recordActivity(user.id, "WEEKLY_TEST");
  await awardAchievement(user.id, "first_weekly_test");

  const updatedProfile = await prisma.learningProfile.findUnique({ where: { userId: user.id } });

  return {
    overallScore,
    breakdown,
    weakAreas: updatedProfile?.weakAreas.map((p) => p.toLowerCase()) ?? [],
  };
}
