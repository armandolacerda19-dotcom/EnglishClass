"use server";

import { requireUser } from "@/lib/session";
import type { Pillar } from "@prisma/client";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";

export interface TopicPracticeAnswer {
  exerciseId: string;
  isCorrect: boolean; // já determinado pergunta a pergunta (checkAnswer.ts para texto livre)
}

export interface TopicPracticeResult {
  correct: number;
  total: number;
}

// Sessão de prática por tema (sem gate semanal, ao contrário do Diagnóstico) —
// atualiza só o score do pilar escolhido, sem criar AssessmentResult (isso fica
// reservado para o Diagnóstico Semanal, para não poluir os checkpoints). A
// correção já foi feita pergunta a pergunta (ver checkAnswer.ts — texto livre
// usa correção tolerante por IA, escolha múltipla é exata), aqui só se agrega.
export async function submitTopicPractice(pillar: Pillar, answers: TopicPracticeAnswer[]): Promise<TopicPracticeResult> {
  const user = await requireUser();

  let correct = 0;
  for (const answer of answers) {
    if (answer.isCorrect) correct += 1;
    await recordActivity(user.id, answer.isCorrect ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  }

  if (answers.length > 0) {
    await updateSkillScore(user.id, pillar, Math.round((correct / answers.length) * 100));
  }

  return { correct, total: answers.length };
}
