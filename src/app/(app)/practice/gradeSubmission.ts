import { prisma } from "@/lib/prisma";
import { gradeFreeTextAnswer } from "@/lib/ai/gradeAnswer";

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

export async function gradeAnswersOnServer(answers: SubmittedAnswer[]): Promise<Map<string, boolean>> {
  const results = new Map<string, boolean>();
  if (answers.length === 0) return results;

  const exercises = await prisma.exercise.findMany({
    where: { id: { in: answers.map((a) => a.exerciseId) } },
  });
  const byId = new Map(exercises.map((e) => [e.id, e]));

  for (const answer of answers) {
    const exercise = byId.get(answer.exerciseId);
    if (!exercise) {
      results.set(answer.exerciseId, false);
      continue;
    }

    const content = exercise.contentJson as any;
    const correctAnswers = (content.correct_answer as string[]) ?? [];
    const exact = correctAnswers.some(
      (c) => c.trim().toLowerCase() === answer.given.trim().toLowerCase()
    );

    if (exact) {
      results.set(answer.exerciseId, true);
      continue;
    }

    // Sem distratores = pergunta de texto livre (tradução): aceita fraseado
    // alternativo válido via IA, tal como na correção durante o quiz.
    const hasDistractors = ((content.distractors as string[]) ?? []).length > 0;
    if (hasDistractors) {
      results.set(answer.exerciseId, false);
      continue;
    }

    const isCorrect = await gradeFreeTextAnswer(content.prompt as string, correctAnswers, answer.given);
    results.set(answer.exerciseId, isCorrect);
  }

  return results;
}
