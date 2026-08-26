"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { anthropic, TUTOR_MODEL } from "@/lib/ai/anthropic";

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
    await prisma.userError.create({
      data: {
        userId: user.id,
        pillar: exercise.pillar,
        errorType: (content.tags?.[0] as string) ?? "unspecified",
        commonMistakePt: content.common_mistake_pt,
        sourceText: given,
        correction: content.correct_answer[0],
      },
    });
  }

  return { isCorrect, explanation: content.explanation as string, attemptId: attempt.id };
}

export async function submitWriting(prompt: string, text: string) {
  const user = await requireUser();

  const feedback = await getHolisticFeedback("writing", prompt, text);

  await prisma.writingAttempt.create({
    data: { userId: user.id, prompt, text, source: "LESSON", feedbackJson: feedback },
  });

  return feedback;
}

export async function submitSpeaking(prompt: string, transcript: string) {
  const user = await requireUser();

  const feedback = await getHolisticFeedback("speaking", prompt, transcript);

  await prisma.speakingAttempt.create({
    data: { userId: user.id, prompt, audioUrl: "", transcript, source: "LESSON", feedbackJson: feedback },
  });

  return feedback;
}

export async function submitTranslation(exerciseId: string, given: string) {
  const user = await requireUser();
  const exercise = await prisma.exercise.findUniqueOrThrow({ where: { id: exerciseId } });
  const content = exercise.contentJson as any;

  const feedback = await getHolisticFeedback("translation", content.prompt, given);
  const looksCorrect = feedback.toLowerCase().includes("correct") && !feedback.toLowerCase().includes("incorrect");

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

  return { feedback, referenceAnswer: content.correct_answer[0] as string };
}

// Correção de writing/speaking/translation seguindo docs/06-arquitetura-ia.md:
// gramática, vocabulário, coerência, registo, naturalidade — nunca inventar regras,
// distinguir "correto" de "mais natural".
async function getHolisticFeedback(kind: "writing" | "speaking" | "translation", prompt: string, text: string) {
  if (!text.trim()) return "Não foi possível avaliar: resposta vazia.";

  const message = await anthropic.messages.create({
    model: TUTOR_MODEL,
    max_tokens: 300,
    system:
      "You are correcting a single " +
      kind +
      " response from an adult Portuguese-speaking English learner. " +
      "Cover grammar, vocabulary, spelling/punctuation where relevant, coherence, register and naturalness. " +
      'Explicitly distinguish "incorrect" from "not natural / not idiomatic". Never invent a grammar rule — ' +
      "say you are not sure rather than guess. Keep the feedback under 120 words, in English, direct and encouraging.",
    messages: [{ role: "user", content: `Prompt: ${prompt}\nLearner response: ${text}` }],
  });

  return message.content.find((b) => b.type === "text")?.text ?? "";
}
