"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { logEvent } from "@/lib/analytics";
import { maybeIssueCertificate } from "@/lib/certificate";
import { gradeAnswersOnServer } from "@/app/(app)/practice/gradeSubmission";

const VALID_PILLARS = new Set<string>([
  "GRAMMAR",
  "VOCABULARY",
  "LISTENING",
  "SPEAKING",
  "PRONUNCIATION",
  "READING",
  "WRITING",
  "TRANSLATION",
]);
const MAX_ANSWERS = 50; // o teste tem 10 perguntas; 50 é folga generosa

export interface WeeklyTestAnswer {
  exerciseId: string;
  pillar: Pillar;
  given: string; // a resposta em bruto — o servidor corrige, nunca confia no cliente
}

export interface WeeklyTestResult {
  overallScore: number;
  breakdown: { pillar: Pillar; correct: number; total: number }[];
  weakAreas: string[];
  newCertificateCode: string | null;
}

// Fecha o Diagnóstico Semanal. O servidor volta a corrigir todas as respostas a
// partir do Exercise real (gradeSubmission.ts) — a correção feita no cliente
// durante o quiz serve só para feedback imediato e nunca é aceite como verdade.
// Atualiza o octógono por pilar e regista um AssessmentResult tipo WEEKLY, a
// mesma fonte de dados que alimenta os checkpoints em /progress.
export async function submitWeeklyTest(answers: WeeklyTestAnswer[]): Promise<WeeklyTestResult> {
  const user = await requireUser();

  // Validação de fronteira: sem isto, um cliente podia enviar milhares de
  // entradas (amplificação de pedidos) ou um `pillar` inventado, que rebentava
  // com o update do Prisma em skillProfile.ts com um 500.
  if (!Array.isArray(answers)) throw new Error("Formato de respostas inválido.");
  const safeAnswers = answers
    .slice(0, MAX_ANSWERS)
    .filter(
      (a) =>
        a &&
        typeof a.exerciseId === "string" &&
        typeof a.given === "string" &&
        VALID_PILLARS.has(a.pillar as unknown as string)
    );

  // Correção autoritativa no servidor — ver gradeSubmission.ts.
  const graded = await gradeAnswersOnServer(
    safeAnswers.map((a) => ({ exerciseId: a.exerciseId, given: a.given }))
  );

  const byPillar = new Map<Pillar, { correct: number; total: number }>();
  for (const answer of safeAnswers) {
    const bucket = byPillar.get(answer.pillar) ?? { correct: 0, total: 0 };
    bucket.total += 1;
    if (graded.get(answer.exerciseId)) bucket.correct += 1;
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
