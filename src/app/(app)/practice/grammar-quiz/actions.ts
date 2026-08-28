"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { exactMatchGrade } from "@/lib/exercise/grading";
import { recordExerciseResult } from "@/lib/exercise/progress";
import { gradeGrammarApply } from "@/lib/ai/gradeGrammarApply";
import type { GradingResult } from "@/lib/exercise/types";
import type { GrammarApplyResult } from "@/lib/ai/gradeGrammarApply";

// Camada Challenge: mesma exigência de segurança já estabelecida — o
// servidor lê o Exercise real por id, nunca confia numa resposta "correta"
// vinda do cliente.
export async function submitGrammarChallenge(exerciseId: string, given: string): Promise<GradingResult> {
  const user = await requireUser();
  const exercise = await prisma.exercise.findUnique({ where: { id: exerciseId } });
  if (!exercise) return { isCorrect: false, score: 0 };

  const content = exercise.contentJson as any;
  const correctAnswers = (content.correct_answer as string[]) ?? [];
  const result = exactMatchGrade(given, correctAnswers);

  await recordExerciseResult({
    userId: user.id,
    pillar: exercise.pillar,
    kind: "grammar_topic_quiz",
    score: result.score,
    correct: result.isCorrect === true,
  });

  return result;
}

// Camada Apply: escrever em contexto real. Servidor lê a regra real do
// GrammarConcept por id, nunca confia num "usesStructure" já decidido.
export async function submitGrammarApply(conceptId: string, given: string): Promise<GrammarApplyResult> {
  const user = await requireUser();
  const concept = await prisma.grammarConcept.findUnique({ where: { id: conceptId } });
  if (!concept) return { usesStructure: false, tip: "Tópico não encontrado." };

  const result = await gradeGrammarApply(concept.title, concept.rule, given, user.id);

  await recordExerciseResult({
    userId: user.id,
    pillar: "GRAMMAR",
    kind: "grammar_topic_quiz",
    score: result.usesStructure ? 100 : 40,
    correct: result.usesStructure,
    achievementCode: "first_grammar_quiz",
  });

  return result;
}
