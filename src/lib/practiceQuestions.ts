import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";

// Motor partilhado de seleção de exercícios já seedados (Exercise.contentJson) —
// usado pelo Diagnóstico Semanal (src/lib/weeklyTest.ts) e pelas Sheets de tema
// (/practice/topic). Substitui a versão anterior que só suportava escolha
// múltipla: exercícios sem distratores (ex. TRANSLATION, cuja resposta é uma
// frase livre) passam a aparecer como pergunta de texto em vez de ficarem de
// fora — ver docs/decisions.md 2026-08-26 (feedback do utilizador: "quando faz
// a pergunta translate, não aparece hipótese de traduzir").

export interface PracticeQuestion {
  exerciseId: string;
  pillar: Pillar;
  kind: "choice" | "text";
  prompt: string;
  options: string[]; // só relevante quando kind === "choice"; inclui a resposta certa, baralhada
  correctAnswers: string[]; // todas as respostas aceites — usado para corrigir e para mostrar a correção
  transcript: string | null; // exercícios LISTENING têm isto — lido em voz alta via PlayTranscript
}

function seededShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr;
}

function seededPick<T>(items: T[], seed: number, count: number): T[] {
  return seededShuffle(items, seed).slice(0, count);
}

export async function buildQuestionSet(
  pillars: Pillar[],
  seed: number,
  perPillar: number
): Promise<PracticeQuestion[]> {
  const questions: PracticeQuestion[] = [];

  // Uma query para todos os pilares, não uma por pilar — antes disto, o
  // Diagnóstico Semanal (5 pilares) fazia 5 idas sequenciais à base de dados
  // só para montar a lista de perguntas. `qaApproved: true` também passou a
  // ser respeitado: antes o filtro existia no schema mas nunca era aplicado,
  // por isso conteúdo não aprovado por QA podia ser servido aos utilizadores.
  // Ver docs/decisions.md, auditoria 2026-08-26.
  const allExercises = await prisma.exercise.findMany({
    where: { pillar: { in: pillars }, qaApproved: true },
    orderBy: { id: "asc" },
  });
  const byPillar = new Map<Pillar, typeof allExercises>();
  for (const ex of allExercises) {
    const bucket = byPillar.get(ex.pillar) ?? [];
    bucket.push(ex);
    byPillar.set(ex.pillar, bucket);
  }

  for (const pillar of pillars) {
    const exercises = byPillar.get(pillar) ?? [];
    if (exercises.length === 0) continue;

    const picked = seededPick(exercises, seed + pillar.length * 97, Math.min(perPillar, exercises.length));
    for (const ex of picked) {
      const content = ex.contentJson as any;
      const correctAnswers = (content.correct_answer as string[]) ?? [];
      const primary = correctAnswers[0];
      if (!primary) continue;

      const distractors = (content.distractors as string[]) ?? [];
      const kind: "choice" | "text" = distractors.length > 0 ? "choice" : "text";
      const options =
        kind === "choice"
          ? seededPick([primary, ...distractors], seed + ex.id.length, Math.min(4, distractors.length + 1))
          : [];

      questions.push({
        exerciseId: ex.id,
        pillar,
        kind,
        prompt: content.prompt as string,
        options,
        correctAnswers,
        transcript: (content.transcript as string) ?? null,
      });
    }
  }

  return questions;
}
