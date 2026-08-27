import { NextResponse } from "next/server";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";

// Exportação de dados pessoais — RGPD, disponível desde o MVP1 (secção 10 do master prompt).
export async function GET() {
  const user = await requireUser();

  // Antes faltavam UserAchievement, AssessmentResult e ReviewScheduleItem — a
  // exportação RGPD não incluía as conquistas do utilizador, os resultados de
  // testes/diagnósticos, nem a fila de revisão espaçada, apesar de todos serem
  // dados pessoais gerados pelo próprio utilizador. Ver docs/decisions.md,
  // auditoria 2026-08-26.
  const [
    learningProfile,
    exerciseAttempts,
    speakingAttempts,
    writingAttempts,
    translations,
    errors,
    aiConversations,
    certificates,
    achievements,
    assessmentResults,
    reviewSchedule,
    placementTests,
  ] = await Promise.all([
    prisma.learningProfile.findUnique({ where: { userId: user.id } }),
    prisma.exerciseAttempt.findMany({ where: { userId: user.id } }),
    prisma.speakingAttempt.findMany({ where: { userId: user.id } }),
    prisma.writingAttempt.findMany({ where: { userId: user.id } }),
    prisma.translation.findMany({ where: { userId: user.id } }),
    prisma.userError.findMany({ where: { userId: user.id } }),
    prisma.aIConversation.findMany({ where: { userId: user.id } }),
    prisma.certificate.findMany({ where: { userId: user.id } }),
    prisma.userAchievement.findMany({ where: { userId: user.id }, include: { achievement: true } }),
    prisma.assessmentResult.findMany({ where: { userId: user.id } }),
    prisma.reviewScheduleItem.findMany({ where: { userId: user.id } }),
    prisma.placementTest.findMany({ where: { userId: user.id } }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    user: { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt },
    learningProfile,
    exerciseAttempts,
    speakingAttempts,
    writingAttempts,
    translations,
    errors,
    aiConversations,
    certificates,
    achievements,
    assessmentResults,
    reviewSchedule,
    placementTests,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="ingles-platform-dados-${user.id}.json"`,
    },
  });
}
