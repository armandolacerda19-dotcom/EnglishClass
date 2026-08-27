"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getGeminiModel } from "@/lib/ai/gemini";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { scheduleReview } from "@/lib/srs/schedule";
import { updateSkillScore } from "@/lib/skillProfile";
import { awardAchievement } from "@/lib/gamification/awardAchievement";

export async function submitExerciseAnswer(exerciseId: string, given: string) {
  const user = await requireUser();

  const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: exerciseId } });
  const content = exercise.contentJson as any;
  const isCorrect = (content.correct_answer as string[]).some(
    (c) => c.trim().toLowerCase() === given.trim().toLowerCase()
  );

  const attempt = await prisma.exerciseAttempt.create({
    data: {
      userId: user.id,
      exerciseId,
      source: "LESSON",
      score: isCorrect ? 100 : 0,
      answers: {
        create: {
          questionId: exerciseId, // MVP1: um Exercise = uma Question implícita
          givenAnswer: given,
          isCorrect,
        },
      },
    },
  });

  if (!isCorrect && content.common_mistake_pt) {
    const errorType = (content.tags?.[0] as string) ?? "unspecified";
    const existingError = await prisma.userError.findFirst({
      where: { userId: user.id, errorType, resolvedAt: null },
    });

    const userError = existingError
      ? await prisma.userError.update({
          where: { id: existingError.id },
          data: {
            occurrences: { increment: 1 },
            lastOccurredAt: new Date(),
            sourceText: given,
          },
        })
      : await prisma.userError.create({
          data: {
            userId: user.id,
            pillar: exercise.pillar,
            errorType,
            commonMistakePt: content.common_mistake_pt,
            sourceText: given,
            correction: content.correct_answer[0],
          },
        });

    // Entra na fila de revisão espaçada (SM-2) — falhou agora, por isso volta a
    // aparecer já amanhã em /practice/review, não daqui a semanas.
    await scheduleReview(user.id, "error", userError.id, 1, userError.id);
  }

  await recordActivity(user.id, isCorrect ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
  // Alimenta o octógono de competência (SkillOctagon) — sem isto o score do pilar
  // ficava congelado no valor do placement test para sempre. Ver docs/decisions.md.
  await updateSkillScore(user.id, exercise.pillar, isCorrect ? 100 : 20);

  return { isCorrect, explanation: content.explanation as string, attemptId: attempt.id };
}

export async function submitWriting(prompt: string, text: string) {
  const user = await requireUser();

  const { feedback, score } = await getHolisticFeedback("writing", prompt, text);

  await prisma.writingAttempt.create({
    data: { userId: user.id, prompt, text, source: "LESSON", feedbackJson: feedback, score },
  });
  await recordActivity(user.id, "WRITING");
  if (score !== null) await updateSkillScore(user.id, "WRITING", score);

  return feedback;
}

export async function submitSpeaking(prompt: string, transcript: string) {
  const user = await requireUser();

  const { feedback, score } = await getHolisticFeedback("speaking", prompt, transcript);

  await prisma.speakingAttempt.create({
    data: { userId: user.id, prompt, audioUrl: "", transcript, source: "LESSON", feedbackJson: feedback, fluencyScore: score },
  });
  await recordActivity(user.id, "SPEAKING");
  if (score !== null) await updateSkillScore(user.id, "SPEAKING", score);

  return feedback;
}

export async function submitTranslation(exerciseId: string, given: string) {
  const user = await requireUser();
  const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: exerciseId } });
  const content = exercise.contentJson as any;

  const { feedback, score } = await getHolisticFeedback("translation", content.prompt, given);
  const looksCorrect = score !== null ? score >= 70 : feedback.toLowerCase().includes("correct") && !feedback.toLowerCase().includes("incorrect");

  await prisma.translation.create({
    data: {
      userId: user.id,
      sourceText: content.prompt,
      sourceLang: "pt",
      userAnswer: given,
      correctAnswer: content.correct_answer[0],
      isCorrect: looksCorrect,
    },
  });

  await recordActivity(user.id, "TRANSLATION");
  await updateSkillScore(user.id, "TRANSLATION", score ?? (looksCorrect ? 100 : 20));

  return { feedback, referenceAnswer: content.correct_answer[0] as string };
}

// Chamado pelo LessonRunner quando o utilizador chega ao ecrã final da lição —
// XP extra de conclusão, para além do XP por passo já atribuído acima, e a
// conquista "Primeira Lição" na primeira vez.
export async function completeLesson() {
  const user = await requireUser();
  await recordActivity(user.id, "LESSON_COMPLETE");
  await awardAchievement(user.id, "first_lesson_complete");
}

interface HolisticFeedback {
  feedback: string;
  score: number | null; // 0-100, null se a IA falhou ou não devolveu um score parseável
}

// Correção de writing/speaking/translation seguindo docs/06-arquitetura-ia.md:
// gramática, vocabulário, coerência, registo, naturalidade — nunca inventar regras,
// distinguir "correto" de "mais natural". Pede também um score 0-100 numa linha à
// parte (não JSON mode, para não depender de suporte específico da API) para
// alimentar o octógono de competência (src/lib/skillProfile.ts) e os campos
// score/fluencyScore do schema, que antes existiam mas nunca eram preenchidos.
async function getHolisticFeedback(
  kind: "writing" | "speaking" | "translation",
  prompt: string,
  text: string
): Promise<HolisticFeedback> {
  if (!text.trim()) return { feedback: "Não foi possível avaliar: resposta vazia.", score: null };

  try {
    const model = getGeminiModel(
      "You are correcting a single " +
        kind +
        " response from an adult Portuguese-speaking English learner. " +
        "Cover grammar, vocabulary, spelling/punctuation where relevant, coherence, register and naturalness. " +
        'Explicitly distinguish "incorrect" from "not natural / not idiomatic". Never invent a grammar rule — ' +
        "say you are not sure rather than guess. Keep the feedback under 120 words, in English, direct and encouraging. " +
        "End your response on its own final line with exactly: SCORE: <a number from 0 to 100 rating how correct and natural the response was>."
    );

    const result = await model.generateContent(`Prompt: ${prompt}\nLearner response: ${text}`);
    const raw = result.response.text();

    const match = raw.match(/SCORE:\s*(\d{1,3})\s*$/i);
    const score = match?.[1] ? Math.max(0, Math.min(100, parseInt(match[1], 10))) : null;
    const feedback = raw.replace(/\n?SCORE:\s*\d{1,3}\s*$/i, "").trim();

    return { feedback, score };
  } catch (error) {
    console.error("Gemini feedback request failed", error);
    return {
      feedback: "Não foi possível avaliar esta resposta agora — pode ser um problema temporário com o serviço de IA. Tente novamente daqui a pouco.",
      score: null,
    };
  }
}
