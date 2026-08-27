"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";

export interface TopicPracticeAnswer {
  exerciseId: string;
  given: string;
}

export interface TopicPracticeResult {
  correct: number;
  total: number;
}

// Sessão de prática por tema (sem gate semanal, ao contrário do Diagnóstico) —
// atualiza só o score do pilar escolhido, sem criar AssessmentResult (isso fica
// reservado para o Diagnóstico Semanal, para não poluir os checkpoints).
export async function submitTopicPractice(pillar: Pillar, answers: TopicPracticeAnswer[]): Promise<TopicPracticeResult> {
  const user = await requireUser();

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: answers.map((a) => a.exerciseId) } },
  });
  const byId = new Map(exercises.map((e) => [e.id, e]));

  let correct = 0;
  for (const answer of answers) {
    const exercise = byId.get(answer.exerciseId);
    if (!exercise) continue;
    const content = exercise.contentJson as any;
    const isCorrect = (content.correct_answer as string[]).some(
      (c) => c.trim().toLowerCase() === answer.given.trim().toLowerCase()
    );
    if (isCorrect) correct += 1;
    await recordActivity(user.id, isCorrect ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  }

  if (answers.length > 0) {
    await updateSkillScore(user.id, pillar, Math.round((correct / answers.length) * 100));
  }

  return { correct, total: answers.length };
}
