"use server";

import { requireUser } from "@/lib/session";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { updateSkillScore } from "@/lib/skillProfile";
import { getReadingPassage } from "@/content/readingPassages";

// Fase 8 (auditoria 2026-08-27) — mesma correção da dictation/actions.ts:
// antes recebia `correct`/`total` do cliente sem verificação. Agora recebe
// o id do texto e as respostas escolhidas por pergunta, e recalcula a
// correção aqui a partir de `content/readingPassages.ts` — a mesma fonte
// que o ReadingRunner já usa no cliente.
export async function submitReadingPractice(passageId: string, answers: { questionId: string; selected: string }[]) {
  const user = await requireUser();

  const passage = getReadingPassage(passageId);
  const total = passage?.questions.length ?? 0;
  const correct = passage
    ? answers.filter((a) => {
        const question = passage.questions.find((q) => q.id === a.questionId);
        return question ? question.correctAnswer === a.selected : false;
      }).length
    : 0;

  if (total > 0) {
    await updateSkillScore(user.id, "READING", Math.round((correct / total) * 100));
  }
  await recordActivity(user.id, correct === total ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  await awardAchievement(user.id, "first_reading_passage");

  return { correct, total };
}
