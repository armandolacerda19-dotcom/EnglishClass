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

// Puxa até `limit` itens vencidos, mais antigos primeiro, com o conteúdo já
// resolvido (palavra ou erro) para a UI não precisar de mais nenhuma query.
export async function getDueReviews(userId: string, limit = 15): Promise<DueReview[]> {
  const items = await prisma.reviewScheduleItem.findMany({
    where: { userId, dueAt: { lte: new Date() } },
    orderBy: { dueAt: "asc" },
    take: limit,
    include: { userError: true },
  });
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
