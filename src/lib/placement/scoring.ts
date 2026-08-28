import { PLACEMENT_QUESTIONS, type PlacementPillar } from "./questions";

const DIFFICULTY_WEIGHT: Record<string, number> = { PRE_A1: 1, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5 };
const LEVEL_ORDER = ["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

export interface PlacementAnswer {
  questionId: string;
  answer: string; // resposta escolhida, ou transcrição/texto para freeResponse
  aiScore?: number; // 0-100, preenchido pela IA para perguntas freeResponse
}

export interface PlacementResult {
  skillProfile: Record<PlacementPillar, number>; // 0-100
  weakAreas: PlacementPillar[];
  resultLevel: (typeof LEVEL_ORDER)[number];
  resultSublevel: number;
}

// Scoring simplificado para MVP1: cada pilar soma pontos ponderados pela dificuldade
// das perguntas respondidas corretamente (ou pelo aiScore, para freeResponse) e
// normaliza para 0-100. O nível global é derivado da média dos 8 pilares.
export function scorePlacementTest(answers: PlacementAnswer[]): PlacementResult {
  const byId = new Map(answers.map((a) => [a.questionId, a]));
  const pillarPoints: Record<string, { earned: number; possible: number }> = {};

  for (const q of PLACEMENT_QUESTIONS) {
    const weight = DIFFICULTY_WEIGHT[q.difficultyLevel] ?? 1;
    const bucket = (pillarPoints[q.pillar] ??= { earned: 0, possible: 0 });
    bucket.possible += weight;

    const given = byId.get(q.id);
    if (!given) continue;

    if (q.freeResponse) {
      bucket.earned += ((given.aiScore ?? 0) / 100) * weight;
    } else if (given.answer?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()) {
      bucket.earned += weight;
    }
  }

  const skillProfile = Object.fromEntries(
    Object.entries(pillarPoints).map(([pillar, { earned, possible }]) => [
      pillar,
      possible === 0 ? 0 : Math.round((earned / possible) * 100),
    ])
  ) as Record<PlacementPillar, number>;

  const scores = Object.values(skillProfile);
  const average = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  const weakAreas = (Object.entries(skillProfile) as [PlacementPillar, number][])
    .filter(([, score]) => score < average - 10)
    .map(([pillar]) => pillar);

  const { level, sublevel } = averageToLevel(average);

  return { skillProfile, weakAreas, resultLevel: level, resultSublevel: sublevel };
}

// Mapeamento 0-100 → nível/subnível, cobrindo agora os 12 subníveis com
// conteúdo seedado (Pre-A1 a C1.2 — ver content/curriculum/levels.json).
// Histórico: até 2026-08-26, qualquer resultado acima de A1 ficava preso em
// A1.3 mesmo já existindo currículo de A2. Corrigido nessa altura, mas o
// corte ficou preso em A2.2 mesmo depois de o currículo ganhar 13 módulos de
// B1 (Fases 4/9) — um utilizador que acertasse TODAS as perguntas do teste
// continuava a ser colocado em A2.2, abaixo do seu nível real. Corrigido ao
// introduzir B2 (Fase 13, 2026-08-27), estendendo os cortes até B2, com 5
// perguntas de dificuldade B2 dedicadas. Ao introduzir C1 (Fase 15,
// 2026-08-27), os cortes foram estendidos outra vez até C1.2, com o mesmo
// cuidado — evitar reintroduzir exatamente o mesmo bug um nível acima.
function averageToLevel(average: number): { level: (typeof LEVEL_ORDER)[number]; sublevel: number } {
  if (average < 8) return { level: "PRE_A1", sublevel: 1 };
  if (average < 18) return { level: "A1", sublevel: 1 };
  if (average < 28) return { level: "A1", sublevel: 2 };
  if (average < 38) return { level: "A1", sublevel: 3 };
  if (average < 48) return { level: "A2", sublevel: 1 };
  if (average < 58) return { level: "A2", sublevel: 2 };
  if (average < 68) return { level: "B1", sublevel: 1 };
  if (average < 76) return { level: "B1", sublevel: 2 };
  if (average < 83) return { level: "B2", sublevel: 1 };
  if (average < 89) return { level: "B2", sublevel: 2 };
  if (average < 95) return { level: "C1", sublevel: 1 };
  return { level: "C1", sublevel: 2 };
}
