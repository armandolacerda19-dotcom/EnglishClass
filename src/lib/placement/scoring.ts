import { PLACEMENT_QUESTIONS, type PlacementPillar } from "./questions";

const DIFFICULTY_WEIGHT: Record<string, number> = { PRE_A1: 1, A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
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

// Mapeamento 0-100 → nível/subnível, cobrindo agora os 14 subníveis com
// conteúdo seedado (Pre-A1 a C2.2 — ver content/curriculum/levels.json).
// Histórico: até 2026-08-26, qualquer resultado acima de A1 ficava preso em
// A1.3 mesmo já existindo currículo de A2. Corrigido nessa altura, mas o
// corte ficou preso em A2.2 mesmo depois de o currículo ganhar 13 módulos de
// B1 (Fases 4/9) — um utilizador que acertasse TODAS as perguntas do teste
// continuava a ser colocado em A2.2, abaixo do seu nível real. Corrigido ao
// introduzir B2 (Fase 13, 2026-08-27) e C1 (Fase 15, 2026-08-27), estendendo
// os cortes de cada vez.
//
// Ao introduzir C2 (Fase 18, 2026-08-28), simplesmente "comprimir" as bandas
// de topo não bastava: `DIFFICULTY_WEIGHT` acrescentou um 6º patamar (peso 6)
// a GRAMMAR/VOCABULARY/LISTENING/READING/TRANSLATION, o que aumenta o
// denominador (`possible`) de TODOS os utilizadores nesses 5 pilares, não só
// de quem chega a C2 — um utilizador "perfeito até B1" via a sua própria
// percentagem em cada um desses pilares cair de 40% para ~28,6%, só por o
// teste ter ficado maior. As 14 bandas abaixo foram recalculadas à mão a
// partir da fórmula real de scorePlacementTest (média das 8 percentagens por
// pilar, cada uma com o novo denominador de 21 nos 5 pilares principais) —
// não ajustadas por tentativa e erro. Ver scoring.test.ts para os valores
// exatos usados como pontos de ancoragem (correto-até-B1 ≈ 55,36%,
// até-B2 ≈ 67,26%, até-C1 ≈ 82,14%, tudo certo = 100%).
function averageToLevel(average: number): { level: (typeof LEVEL_ORDER)[number]; sublevel: number } {
  if (average < 8) return { level: "PRE_A1", sublevel: 1 };
  if (average < 18) return { level: "A1", sublevel: 1 };
  if (average < 28) return { level: "A1", sublevel: 2 };
  if (average < 38) return { level: "A1", sublevel: 3 };
  if (average < 48) return { level: "A2", sublevel: 1 };
  if (average < 53) return { level: "A2", sublevel: 2 };
  if (average < 60) return { level: "B1", sublevel: 1 };
  if (average < 65) return { level: "B1", sublevel: 2 };
  if (average < 72) return { level: "B2", sublevel: 1 };
  if (average < 78) return { level: "B2", sublevel: 2 };
  if (average < 86) return { level: "C1", sublevel: 1 };
  if (average < 93) return { level: "C1", sublevel: 2 };
  if (average < 97) return { level: "C2", sublevel: 1 };
  return { level: "C2", sublevel: 2 };
}
