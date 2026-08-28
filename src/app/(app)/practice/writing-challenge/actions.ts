"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getWritingChallengeItem } from "@/content/writingChallenges";
import { gradeWritingChallenge, type WritingChallengeResult } from "@/lib/ai/gradeWritingChallenge";
import { updateSkillScore } from "@/lib/skillProfile";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { awardAchievement } from "@/lib/gamification/awardAchievement";

// Desafio de Escrita Livre — servidor lê o prompt real por id (o mesmo
// tratamento de fronteira já usado em submitWriting: nunca confiar num
// `prompt` vindo do cliente cru). Grava um WritingAttempt real, mesmo padrão
// já usado pelo WritingStep de lição, para o texto/feedback ficar no
// histórico do utilizador tal como qualquer outra escrita.
export async function submitWritingChallenge(itemId: string, text: string): Promise<WritingChallengeResult> {
  const user = await requireUser();
  const item = getWritingChallengeItem(itemId);
  if (!item) {
    return { grammarScore: 0, vocabularyScore: 0, writingScore: 0, corrections: [], nativeVersion: "", summary: "Desafio não encontrado." };
  }

  const result = await gradeWritingChallenge(item.prompt, text, user.id);

  await prisma.writingAttempt.create({
    data: { userId: user.id, prompt: item.prompt, text, source: "PRACTICE", feedbackJson: result as any, score: result.writingScore },
  });

  await updateSkillScore(user.id, "WRITING", result.writingScore);
  await updateSkillScore(user.id, "GRAMMAR", result.grammarScore);
  await updateSkillScore(user.id, "VOCABULARY", result.vocabularyScore);
  await recordActivity(user.id, "WRITING");
  await awardAchievement(user.id, "first_writing_challenge");

  return result;
}
