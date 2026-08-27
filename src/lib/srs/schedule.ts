import { prisma } from "@/lib/prisma";
import { sm2Next } from "./sm2";

export type ReviewItemType = "vocabulary_item" | "error";

// Regista uma exposição a um item revisável (palavra ou erro) e agenda a próxima
// revisão via SM-2. Chamado a partir de qualquer ponto da app onde o utilizador
// demonstra (ou falha) conhecimento de um item — Desafio Diário, lições, tutor de IA.
export async function scheduleReview(
  userId: string,
  itemType: ReviewItemType,
  itemRefId: string,
  quality: number,
  userErrorId?: string
) {
  const existing = await prisma.reviewScheduleItem.findUnique({
    where: { userId_itemType_itemRefId: { userId, itemType, itemRefId } },
  });

  const now = new Date();
  const next = sm2Next(
    existing
      ? { intervalDays: existing.intervalDays, easeFactor: existing.easeFactor, repetitions: existing.repetitions }
      : { intervalDays: 1, easeFactor: 2.5, repetitions: 0 },
    quality,
    now
  );

  await prisma.reviewScheduleItem.upsert({
    where: { userId_itemType_itemRefId: { userId, itemType, itemRefId } },
    update: {
      intervalDays: next.intervalDays,
      easeFactor: next.easeFactor,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
      lastReviewedAt: now,
      userErrorId,
    },
    create: {
      userId,
      itemType,
      itemRefId,
      userErrorId,
      intervalDays: next.intervalDays,
      easeFactor: next.easeFactor,
      repetitions: next.repetitions,
      dueAt: next.dueAt,
      lastReviewedAt: now,
    },
  });
}

export async function getDueReviewCount(userId: string): Promise<number> {
  return prisma.reviewScheduleItem.count({
    where: { userId, dueAt: { lte: new Date() } },
  });
}

export interface DueVocabReview {
  kind: "vocabulary_item";
  itemRefId: string;
  headword: string;
  translationPt: string;
  definitionEn: string;
  exampleSentences: string[];
  collocations: string[];
}

export interface DueErrorReview {
  kind: "error";
  itemRefId: string;
  userErrorId: string;
  pillar: string;
  commonMistakePt: string | null;
  sourceText: string;
  correction: string;
}

export type DueReview = DueVocabReview | DueErrorReview;

// Puxa até `limit` itens, com o conteúdo já resolvido (palavra ou erro) para a
// UI não precisar de mais nenhuma query.
//
// Fase 11 (auditoria 2026-08-27, secção 3, "accountability por erro
// persistente — conta mas não age"): antes, ordenava só por `dueAt` — um erro
// cometido 12 vezes e outro cometido 1 vez eram indistinguíveis na fila. Agora:
// (1) erros com `occurrences >= 3` ainda não resolvidos entram na fila com
// "repescagem forçada", mesmo que o SM-2 ainda não os tenha marcado como due —
// um erro que se repete tantas vezes merece reforço antes do intervalo normal
// de esquecimento acabar; (2) entre os itens já due, os que têm mais
// `occurrences` aparecem primeiro, não só os mais antigos.
export async function getDueReviews(userId: string, limit = 15): Promise<DueReview[]> {
  const now = new Date();

  const forcedErrors = await prisma.userError.findMany({
    where: { userId, occurrences: { gte: 3 }, resolvedAt: null },
    orderBy: { occurrences: "desc" },
    take: limit,
  });
  const forcedScheduleItems = forcedErrors.length
    ? await prisma.reviewScheduleItem.findMany({
        where: { userId, itemType: "error", userErrorId: { in: forcedErrors.map((e) => e.id) } },
      })
    : [];
  const forcedScheduleByErrorId = new Map(forcedScheduleItems.map((i) => [i.userErrorId as string, i]));

  const dueItems = await prisma.reviewScheduleItem.findMany({
    where: { userId, dueAt: { lte: now } },
    orderBy: { dueAt: "asc" },
    take: Math.max(limit * 3, limit + forcedErrors.length),
    include: { userError: true },
  });

  type ScheduleItemWithError = (typeof dueItems)[number];
  const seen = new Set<string>();
  const ordered: ScheduleItemWithError[] = [];

  for (const err of forcedErrors) {
    const scheduleItem = forcedScheduleByErrorId.get(err.id);
    if (!scheduleItem || seen.has(scheduleItem.id)) continue;
    seen.add(scheduleItem.id);
    ordered.push({ ...scheduleItem, userError: err });
  }

  const restSorted = dueItems
    .filter((i) => !seen.has(i.id))
    .sort(
      (a, b) =>
        (b.userError?.occurrences ?? 0) - (a.userError?.occurrences ?? 0) || a.dueAt.getTime() - b.dueAt.getTime()
    );
  for (const item of restSorted) {
    if (ordered.length >= limit) break;
    seen.add(item.id);
    ordered.push(item);
  }

  const items = ordered.slice(0, limit);
  if (items.length === 0) return [];

  const vocabIds = items.filter((i) => i.itemType === "vocabulary_item").map((i) => i.itemRefId);
  const vocabItems = vocabIds.length
    ? await prisma.vocabularyItem.findMany({ where: { id: { in: vocabIds } } })
    : [];
  const vocabById = new Map(vocabItems.map((v) => [v.id, v]));

  const reviews: DueReview[] = [];
  for (const item of items) {
    if (item.itemType === "vocabulary_item") {
      const word = vocabById.get(item.itemRefId);
      if (!word) continue;
      reviews.push({
        kind: "vocabulary_item",
        itemRefId: word.id,
        headword: word.headword,
        translationPt: word.translationPt,
        definitionEn: word.definitionEn,
        exampleSentences: word.exampleSentences,
        collocations: word.collocations,
      });
    } else if (item.itemType === "error" && item.userError) {
      reviews.push({
        kind: "error",
        itemRefId: item.itemRefId,
        userErrorId: item.userError.id,
        pillar: item.userError.pillar,
        commonMistakePt: item.userError.commonMistakePt,
        sourceText: item.userError.sourceText,
        correction: item.userError.correction,
      });
    }
  }
  return reviews;
}
