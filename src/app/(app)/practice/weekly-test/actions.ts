"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { logEvent } from "@/lib/analytics";
import { maybeIssueCertificate } from "@/lib/certificate";

export interface WeeklyTestAnswer {
  exerciseId: string;
  pillar: Pillar;
  isCorrect: boolean; // já determinado pergunta a pergunta (checkAnswer.ts para texto livre)
}

export interface WeeklyTestResult {
  overallScore: number;
  breakdown: { pillar: Pillar; correct: number; total: number }[];
  weakAreas: string[];
  newCertificateCode: string | null;
}

// Fecha o Diagnóstico Semanal: agrega a correção já feita pergunta a pergunta
// (ver src/app/(app)/practice/checkAnswer.ts — texto livre usa correção tolerante
// por IA, escolha múltipla é exata), atualiza o octógono de competência por pilar
// e regista um AssessmentResult tipo WEEKLY — a mesma fonte de dados que já
// alimenta os checkpoints em /progress.
export async function submitWeeklyTest(answers: WeeklyTestAnswer[]): Promise<WeeklyTestResult> {
  const user = await requireUser();

  const byPillar = new Map<Pillar, { correct: number; total: number }>();
  for (const answer of answers) {
    const bucket = byPillar.get(answer.pillar) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (answer.isCorrect) bucket.correct += 1;
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
  await logEvent(user.id, "weekly_test_completed", { overallScore });
  const certificate = await maybeIssueCertificate(user.id);
  if (certificate) await awardAchievement(user.id, "first_certificate");

  const updatedProfile = await prisma.learningProfile.findUnique({ where: { userId: user.id } });

  return {
    overallScore,
    breakdown,
    weakAreas: updatedProfile?.weakAreas.map((p) => p.toLowerCase()) ?? [],
    newCertificateCode: certificate?.verificationCode ?? null,
  };
}
