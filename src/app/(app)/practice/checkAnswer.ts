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
