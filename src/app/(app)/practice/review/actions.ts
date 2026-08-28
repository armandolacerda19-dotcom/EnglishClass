"use server";

import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { scheduleReview, type ReviewItemType } from "@/lib/srs/schedule";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import { awardAchievement } from "@/lib/gamification/awardAchievement";

// Converte a auto-avaliação estilo Anki (1/3/5) num score 0-100 para o octógono
// de competência — a mesma escala usada nos outros pontos de captura de sinal.
function qualityToScore(quality: number): number {
  if (quality >= 5) return 100;
  if (quality >= 3) return 60;
  return 20;
}

// Auto-avaliação estilo Anki: 1 = não sabia, 3 = custou, 5 = sabia bem.
// Alimenta o SM-2 (src/lib/srs/sm2.ts) para decidir quando o item volta a aparecer.
export async function submitReview(
  itemType: ReviewItemType,
  itemRefId: string,
  quality: number,
  userErrorId?: string
) {
  const user = await requireUser();

  // Validação de fronteira antes de qualquer escrita: `quality` alimenta o
  // cálculo SM-2 (easeFactor/intervalDays) — um valor fora de 0-5 corrompia o
  // agendamento e podia empurrar o `dueAt` para anos no futuro.
  const safeQuality = Number.isFinite(quality) ? Math.max(0, Math.min(5, Math.round(quality))) : 0;

  // Verificação de dono ANTES de agendar: sem isto, era possível passar o
  // userErrorId de outro utilizador e plantá-lo na própria fila de revisão,
  // expondo texto privado dele (sourceText/correction) em /practice/review.
  //
  // Fase 8 (auditoria 2026-08-27, achado IDOR parcial): esta verificação só
  // corria quando itemType === "error" — o ramo "vocabulary_item" aceitava
  // `userErrorId` sem validação nenhuma e reenviava-o para scheduleReview,
  // gravando uma FK alheia na própria linha. `getDueReviews` não expõe hoje
  // esse campo no ramo de vocabulário, mas é uma FK não verificada a uma
  // mudança de UI de distância de vazar. Corrigido: `userErrorId` só é
  // encaminhado quando itemType === "error" E já foi confirmado como dono —
  // em qualquer outro caso, é sempre `undefined`, nunca o valor recebido.
  let userError = null;
  let verifiedUserErrorId: string | undefined;
  if (itemType === "error") {
    if (!userErrorId) return;
    userError = await prisma.userError.findUnique({ where: { id: userErrorId } });
    if (!userError || userError.userId !== user.id) return;
    verifiedUserErrorId = userErrorId;
  }

  // Fase 16 (auditoria 2026-08-28, achado crítico): o ramo "vocabulary_item"
  // aceitava qualquer `itemRefId` sem confirmar que corresponde a um
  // VocabularyItem real — um pedido direto ao Server Action com um id
  // inventado e quality=5 subia VOCABULARY para 100 sem nunca ter existido
  // uma palavra por trás. Como `maybeIssueCertificate` agora avança
  // currentLevel/currentSublevel a sério (Fase 15), isto deixou de ser só um
  // certificado cosmético — passou a falsificar progressão real de nível.
  // Mesma validação de existência já usada no ramo "error" acima.
  if (itemType === "vocabulary_item") {
    const vocabularyItem = await prisma.vocabularyItem.findUnique({ where: { id: itemRefId } });
    if (!vocabularyItem) return;
  }

  await scheduleReview(user.id, itemType, itemRefId, safeQuality, verifiedUserErrorId);
  await recordActivity(user.id, "REVIEW");
  await awardAchievement(user.id, "first_review");

  if (itemType === "vocabulary_item") {
    await updateSkillScore(user.id, "VOCABULARY", qualityToScore(safeQuality));
    return;
  }

  if (!userError || !userErrorId) return;

  await updateSkillScore(user.id, userError.pillar, qualityToScore(safeQuality));

  // Marca o erro como resolvido depois de 3 revisões seguidas bem-sucedidas
  // (SM-2 chega a `repetitions >= 3` só com quality >= 3). Antes disto,
  // `resolvedAt` nunca era escrito em lado nenhum: o contador "erros já
  // corrigidos" em /progress ficava permanentemente a 0 e a lista de erros
  // crescia para sempre, mesmo depois de o utilizador dominar o erro.
  if (safeQuality >= 3) {
    const item = await prisma.reviewScheduleItem.findUnique({
      where: { userId_itemType_itemRefId: { userId: user.id, itemType: "error", itemRefId: userErrorId } },
    });
    if (item && item.repetitions >= 3) {
      await prisma.userError.update({ where: { id: userErrorId }, data: { resolvedAt: new Date() } });
    }
  } else {
    // Voltou a falhar um erro já dado como resolvido — reabre-o.
    if (userError.resolvedAt) {
      await prisma.userError.update({ where: { id: userErrorId }, data: { resolvedAt: null } });
    }
  }
}
