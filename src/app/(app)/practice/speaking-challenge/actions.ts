"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getSpeakingChallengeItem } from "@/content/speakingChallenges";
import { gradeSpeakingChallenge, type SpeakingChallengeResult } from "@/lib/ai/gradeSpeakingChallenge";
import { updateSkillScore } from "@/lib/skillProfile";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";

// Desafio de Discurso Livre — servidor lê o prompt real por id (mesmo
// tratamento de fronteira já usado em submitWritingChallenge: nunca confiar
// num `prompt` vindo do cliente cru). `audioUrl: ""` segue o mesmo padrão já
// estabelecido em submitSpeaking (learn/actions.ts) — a app não grava nem
// envia áudio real para nenhum servidor (custo zero, Web Speech API só no
// browser), por isso o campo fica sempre vazio, nunca fabricado.
export async function submitSpeakingChallenge(
  itemId: string,
  transcript: string,
  durationMs: number | null
): Promise<SpeakingChallengeResult> {
  const user = await requireUser();
  const item = getSpeakingChallengeItem(itemId);
  if (!item) {
    return {
      grammarScore: 0,
      vocabularyScore: 0,
      coherenceScore: 0,
      fluencyScore: 0,
      speakingScore: 0,
      wordsPerMinute: null,
      corrections: [],
      summary: "Desafio não encontrado.",
    };
  }

  // Mesma validação de fronteira já usada em submitSpeaking (learn/actions.ts)
  // para responseTimeMs — um valor negativo ou absurdo não deve corromper o
  // WPM calculado em gradeSpeakingChallenge.
  const safeDurationMs =
    typeof durationMs === "number" && Number.isFinite(durationMs) && durationMs >= 0
      ? Math.min(durationMs, 10 * 60 * 1000)
      : null;

  const result = await gradeSpeakingChallenge(item.prompt, transcript, safeDurationMs, user.id);

  await prisma.speakingAttempt.create({
    data: {
      userId: user.id,
      prompt: item.prompt,
      audioUrl: "",
      transcript,
      source: "PRACTICE",
      feedbackJson: result as any,
      fluencyScore: result.fluencyScore,
      responseTimeMs: safeDurationMs,
    },
  });

  await updateSkillScore(user.id, "SPEAKING", result.speakingScore);
  await updateSkillScore(user.id, "GRAMMAR", result.grammarScore);
  await updateSkillScore(user.id, "VOCABULARY", result.vocabularyScore);
  await recordActivity(user.id, "SPEAKING");
  await awardAchievement(user.id, "first_speaking_challenge");

  return result;
}
