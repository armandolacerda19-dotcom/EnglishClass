import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";
import { recommendNextActivity, shouldReviewFirst, KIND_ROUTE, type Recommendation } from "./recommend";
import type { ExerciseKind } from "./types";

// Liga o motor puro (recommend.ts) aos dados reais do utilizador — usado pela
// Home (Standard e Intensive). Antes desta ligação, `recommendNextActivity`
// existia mas nunca era chamado por nada: uma "adaptive learning" que só
// funcionava em teoria, exatamente o tipo de funcionalidade sem integração
// que não devia existir (docs/12-exercise-engine.md).

const PILLAR_FIELD: Record<Pillar, keyof PillarScores> = {
  GRAMMAR: "grammarScore",
  VOCABULARY: "vocabularyScore",
  LISTENING: "listeningScore",
  SPEAKING: "speakingScore",
  PRONUNCIATION: "pronunciationScore",
  READING: "readingScore",
  WRITING: "writingScore",
  TRANSLATION: "translationScore",
};

interface PillarScores {
  grammarScore: number;
  vocabularyScore: number;
  listeningScore: number;
  speakingScore: number;
  pronunciationScore: number;
  readingScore: number;
  writingScore: number;
  translationScore: number;
}

export interface HomeRecommendation extends Recommendation {
  href: string;
  pillarLabel: string;
}

export async function getRecommendationForUser(
  userId: string,
  weakAreas: Pillar[],
  scores: PillarScores,
  dueReviewCount: number
): Promise<HomeRecommendation | null> {
  // Revisão pendente já é o mecanismo certo para "o que fazer agora" — a
  // recomendação de um exercício novo não compete com isso, só aparece
  // quando não há revisões à espera.
  if (shouldReviewFirst(dueReviewCount)) return null;

  const skills = (Object.keys(PILLAR_FIELD) as Pillar[]).map((pillar) => ({
    pillar,
    score: scores[PILLAR_FIELD[pillar]],
  }));

  const recentKinds = await getRecentKinds(userId);
  const recommendation = recommendNextActivity({ skills, weakAreas, dueReviewCount, recentKinds });

  const href = KIND_ROUTE[recommendation.kind];
  if (!href) return null;

  const { PILLAR_LABEL } = await import("@/lib/pillarDisplay");
  return { ...recommendation, href, pillarLabel: PILLAR_LABEL[recommendation.pillar] ?? recommendation.pillar.toLowerCase() };
}

// "Tipos já feitos nas últimas 24h" — `recordExerciseResult` (progress.ts)
// grava um evento "exercise_completed" com `{kind, pillar}` sempre que um
// exercício do motor novo é concluído; lê-se isso de volta aqui em vez de
// criar uma tabela nova só para isto (AnalyticsEvent já existe e já é
// escrito). Só cobre os tipos construídos sobre o Exercise Engine — os
// Runners mais antigos não passam por `recordExerciseResult`, por isso não
// entram nesta contagem (sinal parcial, não uma conta exaustiva de tudo o
// que o utilizador já fez).
async function getRecentKinds(userId: string): Promise<ExerciseKind[]> {
  const events = await prisma.analyticsEvent.findMany({
    where: { userId, eventName: "exercise_completed", createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { propsJson: true },
  });
  return events
    .map((e) => (e.propsJson as { kind?: string } | null)?.kind)
    .filter((k): k is ExerciseKind => !!k);
}
