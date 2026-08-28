"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { gradeFreeTextAnswer } from "@/lib/ai/gradeAnswer";

export interface CheckFreeTextResult {
  isCorrect: boolean;
  referenceAnswer: string;
}

// Correção de perguntas de texto livre (kind: "text" em practiceQuestions.ts —
// exercícios sem distratores, sobretudo TRANSLATION) no Diagnóstico Semanal e nas
// Sheets de tema. Usa correção tolerante por IA em vez de igualdade exata — ver
// src/lib/ai/gradeAnswer.ts e docs/decisions.md.
export async function checkFreeTextAnswer(exerciseId: string, given: string): Promise<CheckFreeTextResult> {
  const user = await requireUser();

  const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: exerciseId } });
  const content = exercise.contentJson as any;
  const referenceAnswers = (content.correct_answer as string[]) ?? [];
  const isCorrect = await gradeFreeTextAnswer(content.prompt as string, referenceAnswers, given, user.id);

  return { isCorrect, referenceAnswer: referenceAnswers[0] ?? "" };
}

// Fase 16 (auditoria 2026-08-28, achado S4): correção de perguntas de escolha
// múltipla (kind: "choice") no Diagnóstico Semanal e nas Sheets de tema.
// Antes, `PracticeQuestion.correctAnswers` ia embutido no payload de TODAS as
// perguntas do teste, enviado ao cliente logo no carregamento da página —
// bastava abrir as devtools/ver o código-fonte para ler as respostas certas
// das 10 perguntas antes de responder a qualquer uma. `submitWeeklyTest` já
// corrigia a sério no servidor (não era forjável), mas o "diagnóstico" em si
// deixava de testar nada para quem olhasse. Mesmo padrão de round-trip já
// usado em `checkFreeTextAnswer` acima: o exercício é lido de novo da BD,
// nunca confiado no cliente.
export async function checkChoiceAnswer(exerciseId: string, given: string): Promise<CheckFreeTextResult> {
  await requireUser();

  const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: exerciseId } });
  const content = exercise.contentJson as any;
  const referenceAnswers = (content.correct_answer as string[]) ?? [];
  const isCorrect = referenceAnswers.some((c) => c.trim().toLowerCase() === given.trim().toLowerCase());

  return { isCorrect, referenceAnswer: referenceAnswers[0] ?? "" };
}
