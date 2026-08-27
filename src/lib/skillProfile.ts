import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";

// Mantém o octógono de competência (SkillOctagon) e "Áreas a reforçar" vivos.
// Antes desta função, os 8 scores só eram escritos uma vez no placement test e
// congelavam para sempre — a app deixava de "saber o que o utilizador precisa
// de aprender" logo a seguir ao onboarding. Ver docs/decisions.md 2026-08-26.

const PILLAR_FIELD: Record<Pillar, string> = {
  GRAMMAR: "grammarScore",
  VOCABULARY: "vocabularyScore",
  LISTENING: "listeningScore",
  SPEAKING: "speakingScore",
  PRONUNCIATION: "pronunciationScore",
  READING: "readingScore",
  WRITING: "writingScore",
  TRANSLATION: "translationScore",
};

const ALL_PILLARS = Object.keys(PILLAR_FIELD) as Pillar[];

// Média móvel exponencial — cada nova amostra pesa 25%, para o score reagir
// rápido a uma sequência de erros/acertos sem saltar com um único exercício.
const EMA_ALPHA = 0.25;

// rawScore: 0-100, representa quão bem o utilizador saiu-se nesta exposição
// concreta ao pilar (100 = acertou/natural, 0 = falhou por completo).
export async function updateSkillScore(userId: string, pillar: Pillar, rawScore: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(rawScore)));
  const field = PILLAR_FIELD[pillar];

  const profile = await prisma.learningProfile.findUnique({ where: { userId } });
  if (!profile) return;

  const current = (profile as unknown as Record<string, number>)[field] ?? 0;
  // Primeira amostra: assume o valor diretamente em vez de arrastar a EMA a partir de 0.
  const next = current === 0 ? clamped : Math.round(current * (1 - EMA_ALPHA) + clamped * EMA_ALPHA);

  // `field` é dinâmico (calculado a partir do pilar) — o tipo gerado pelo Prisma
  // não aceita uma chave computada, daí o cast. Os únicos valores possíveis vêm
  // de PILLAR_FIELD acima, todos campos reais de LearningProfile.
  const updatedProfile = await prisma.learningProfile.update({
    where: { userId },
    data: { [field]: next } as any,
  });

  await recalculateAreas(userId, updatedProfile);
}

async function recalculateAreas(userId: string, profile: Record<string, unknown>) {
  const scores = ALL_PILLARS.map((p) => ({ pillar: p, score: (profile as Record<string, number>)[PILLAR_FIELD[p]] ?? 0 }));
  const withSignal = scores.filter((s) => s.score > 0);
  if (withSignal.length < 2) return; // dados a menos para comparar áreas de forma justa

  const average = withSignal.reduce((a, b) => a + b.score, 0) / withSignal.length;

  const weakAreas = withSignal
    .filter((s) => s.score < average - 10)
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map((s) => s.pillar);

  const strongAreas = withSignal
    .filter((s) => s.score > average + 10)
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((s) => s.pillar);

  await prisma.learningProfile.update({
    where: { userId },
    data: { weakAreas, strongAreas },
  });
}
