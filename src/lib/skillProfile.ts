import { prisma } from "@/lib/prisma";
import type { Pillar, Prisma } from "@prisma/client";

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
//
// Tudo corre dentro de uma transação com `SELECT ... FOR UPDATE`: a média móvel
// exponencial é, por natureza, ler→computar→escrever — sem bloquear a linha,
// duas atualizações quase simultâneas liam o mesmo valor e uma apagava o efeito
// da outra silenciosamente (podendo até BAIXAR o score depois de uma resposta
// certa, porque a segunda escrita partia de um valor já desatualizado). O
// bloqueio de linha estende-se a recalculateAreas, que faz o mesmo padrão sobre
// weakAreas/strongAreas. Ver docs/decisions.md, auditoria 2026-08-26.
export async function updateSkillScore(userId: string, pillar: Pillar, rawScore: number) {
  const clamped = Math.max(0, Math.min(100, Math.round(rawScore)));
  const field = PILLAR_FIELD[pillar];

  await prisma.$transaction(async (tx) => {
    // SELECT * em vez de listar colunas: mais simples e seguro do que reconstruir
    // manualmente a lista dos 8 campos de score — este SELECT nunca recebe input
    // do utilizador (userId já vem de requireUser()), por isso não há risco de injeção.
    const rows = await tx.$queryRawUnsafe<Array<Record<string, unknown>>>(
      `SELECT * FROM "LearningProfile" WHERE "userId" = $1 FOR UPDATE`,
      userId
    );
    const profile = rows[0];
    if (!profile) return;

    const current = (profile[field] as number) ?? 0;
    // Primeira amostra: assume o valor diretamente em vez de arrastar a EMA a partir de 0.
    const next = current === 0 ? clamped : Math.round(current * (1 - EMA_ALPHA) + clamped * EMA_ALPHA);

    // `field` é dinâmico (calculado a partir do pilar) — o tipo gerado pelo Prisma
    // não aceita uma chave computada, daí o cast. Os únicos valores possíveis vêm
    // de PILLAR_FIELD acima, todos campos reais de LearningProfile.
    const updatedProfile = await tx.learningProfile.update({
      where: { userId },
      data: { [field]: next } as any,
    });

    await recalculateAreas(tx, userId, updatedProfile as unknown as Record<string, unknown>);
  });
}

async function recalculateAreas(tx: Prisma.TransactionClient, userId: string, profile: Record<string, unknown>) {
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

  await tx.learningProfile.update({
    where: { userId },
    data: { weakAreas, strongAreas },
  });
}
