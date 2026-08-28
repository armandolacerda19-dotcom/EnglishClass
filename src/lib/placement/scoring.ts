import { PLACEMENT_QUESTIONS, type PlacementPillar } from "./questions";

const DIFFICULTY_WEIGHT: Record<string, number> = { PRE_A1: 1, A1: 1, A2: 2, B1: 3 };
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

// Mapeamento 0-100 → nível/subnível, cobrindo agora os 10 subníveis com
// conteúdo seedado (Pre-A1 a B2.2 — ver content/curriculum/levels.json).
// Histórico: até 2026-08-26, qualquer resultado acima de A1 ficava preso em
// A1.3 mesmo já existindo currículo de A2. Corrigido nessa altura, mas o
// corte ficou preso em A2.2 mesmo depois de o currículo ganhar 13 módulos de
// B1 (Fases 4/9) — um utilizador que acertasse TODAS as perguntas do teste,
// incluindo as 5 de dificuldade B1 (peso 3, o mais alto em
// `DIFFICULTY_WEIGHT`), continuava a ser colocado em A2.2, abaixo do seu
// nível real. Achado ao introduzir B2 nesta sessão (Fase 13, 2026-08-27):
// corrigido agora, estendendo os cortes até B2. Nota: o teste ainda não tem
// perguntas de dificuldade B2 (`DIFFICULTY_WEIGHT` não define peso para B2),
// por isso alcançar B2.1/B2.2 exige acertar tudo o resto — heurística
// razoável na ausência de perguntas B2 dedicadas, mas fica registado como
// trabalho futuro em docs/decisions.md.
function averageToLevel(average: number): { level: (typeof LEVEL_ORDER)[number]; sublevel: number } {
  if (average < 10) return { level: "PRE_A1", sublevel: 1 };
  if (average < 22) return { level: "A1", sublevel: 1 };
  if (average < 34) return { level: "A1", sublevel: 2 };
  if (average < 46) return { level: "A1", sublevel: 3 };
  if (average < 58) return { level: "A2", sublevel: 1 };
  if (average < 68) return { level: "A2", sublevel: 2 };
  if (average < 78) return { level: "B1", sublevel: 1 };
  if (average < 86) return { level: "B1", sublevel: 2 };
  if (average < 93) return { level: "B2", sublevel: 1 };
  return { level: "B2", sublevel: 2 };
}
