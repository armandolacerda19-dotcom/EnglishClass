import { prisma } from "@/lib/prisma";
import { gradeFreeTextAnswer } from "@/lib/ai/gradeAnswer";
import type { Pillar } from "@prisma/client";

// Correção AUTORITATIVA no servidor.
//
// Porquê existe: durante o quiz, a correção pergunta-a-pergunta acontece no
// cliente (escolha múltipla) ou via checkAnswer.ts (texto livre) — isso é bom
// para dar feedback instantâneo. Mas o resultado NÃO pode ser aceite como
// verdade no submit final: o browser pode enviar `isCorrect: true` para tudo e
// forjar scores, AssessmentResults e até certificados públicos.
//
// Aqui o servidor volta a corrigir a partir do `Exercise` real. Para texto
// livre, `gradeFreeTextAnswer` tenta igualdade exata primeiro e só chama a IA
// se não bater certo — por isso respostas certas não custam nada.
export interface SubmittedAnswer {
  exerciseId: string;
  given: string;
}

export interface GradedAnswer {
  isCorrect: boolean;
  // Fase 8 (auditoria 2026-08-27, achado N5) — o pilar REAL do Exercise na BD,
  // nunca o que o cliente diz que é. Antes, submitWeeklyTest/submitTopicPractice
  // confiavam no `pillar` enviado pelo cliente para decidir que eixo do
  // octógono atualizar — submeter a resposta certa de um exercício fácil de
  // GRAMMAR rotulado como WRITING inflacionava writingScore. Os chamadores
  // agora usam ESTE campo, não o que veio no pedido.
  pillar: Pillar | null; // null se o exerciseId não existir
}

export async function gradeAnswersOnServer(answers: SubmittedAnswer[], userId: string): Promise<Map<string, GradedAnswer>> {
  const results = new Map<string, GradedAnswer>();
  if (answers.length === 0) return results;

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: answers.map((a) => a.exerciseId) } },
  });
  const byId = new Map(exercises.map((e) => [e.id, e]));

  for (const answer of answers) {
    const exercise = byId.get(answer.exerciseId);
    if (!exercise) {
      results.set(answer.exerciseId, { isCorrect: false, pillar: null });
      continue;
    }

    const content = exercise.contentJson as any;
    const correctAnswers = (content.correct_answer as string[]) ?? [];
    const exact = correctAnswers.some(
      (c) => c.trim().toLowerCase() === answer.given.trim().toLowerCase()
    );

    if (exact) {
      results.set(answer.exerciseId, { isCorrect: true, pillar: exercise.pillar });
      continue;
    }

    // Sem distratores = pergunta de texto livre (tradução): aceita fraseado
    // alternativo válido via IA, tal como na correção durante o quiz.
    const hasDistractors = ((content.distractors as string[]) ?? []).length > 0;
    if (hasDistractors) {
      results.set(answer.exerciseId, { isCorrect: false, pillar: exercise.pillar });
      continue;
    }

    const isCorrect = await gradeFreeTextAnswer(content.prompt as string, correctAnswers, answer.given, userId);
    results.set(answer.exerciseId, { isCorrect, pillar: exercise.pillar });
  }

  return results;
}
