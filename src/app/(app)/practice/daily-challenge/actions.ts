"use server";

import type { Prisma } from "@prisma/client";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { scheduleReview } from "@/lib/srs/schedule";
import { updateSkillScore } from "@/lib/skillProfile";
import { awardAchievement } from "@/lib/gamification/awardAchievement";
import { getDailyChallenge } from "@/lib/dailyChallenge";

function startOfDay(d: Date) {
  const x = new Date(d);
  x.setUTCHours(0, 0, 0, 0);
  return x;
}

// Fase 8 (auditoria 2026-08-27) — antes recebia um `correct: boolean` já
// decidido pelo cliente, que ia direto para updateSkillScore("VOCABULARY", ...) —
// o pilar que alimenta o octógono e o portão do certificado (src/lib/certificate.ts).
// Corrigido: recebe a tradução ESCOLHIDA (`selected`) e compara aqui contra o
// VocabularyItem real na BD — o cliente já não decide se acertou ou não.
export async function recordVocabExposure(vocabularyItemId: string, selected: string) {
  const user = await requireUser();
  const word = await prisma.vocabularyItem.findUnique({ where: { id: vocabularyItemId } });
  const correct = word ? word.translationPt === selected : false;

  await scheduleReview(user.id, "vocabulary_item", vocabularyItemId, correct ? 5 : 1);
  await updateSkillScore(user.id, "VOCABULARY", correct ? 100 : 20);
  return correct;
}

// Checkpoint diário (docs/05-avaliacao-certificacao.md) — completar o Desafio Diário
// de vocabulário conta como o checkpoint do dia. Só a primeira conclusão do dia dá XP,
// para não incentivar repetir só para "farmar" pontos.
//
// Fase 8: `score`/`total` continuam a vir do cliente (esta action não escreve em
// nenhum pilar do octógono — isso já está corrigido em recordVocabExposure acima,
// chamada a cada palavra — só cria um AssessmentResult de checkpoint), mas agora
// são limitados: `total` é sempre recalculado a partir do desafio real de hoje
// (getDailyChallenge), e `score` é fixado entre 0 e esse total, para impedir um
// valor absurdo (ex. score=99999) inflacionar o registo mesmo sem tocar no
// octógono.
export async function completeDailyChallenge(score: number, total: number) {
  const user = await requireUser();
  const todayChallenge = await getDailyChallenge();
  const safeTotal = todayChallenge.length || Math.max(0, Math.trunc(total));
  const safeScore = Math.max(0, Math.min(safeTotal, Math.trunc(score)));

  const todayStart = startOfDay(new Date());

  const existing = await prisma.assessmentResult.findFirst({
    where: { userId: user.id, type: "DAILY", createdAt: { gte: todayStart } },
  });

  if (existing) {
    return { alreadyDoneToday: true };
  }

  await prisma.assessmentResult.create({
    data: {
      userId: user.id,
      type: "DAILY",
      scoreJson: { kind: "vocabulary_challenge", score: safeScore, total: safeTotal } as unknown as Prisma.InputJsonValue,
      passed: safeTotal > 0 && safeScore === safeTotal,
    },
  });
  await recordActivity(user.id, "DAILY_CHALLENGE");
  await awardAchievement(user.id, "first_daily_challenge");

  return { alreadyDoneToday: false };
}
