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

  for (const pillar of pillars) {
    const exercises = await prisma.exercise.findMany({ where: { pillar }, orderBy: { id: "asc" } });
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

      questions.push({ exerciseId: ex.id, pillar, kind, prompt: content.prompt as string, options, correctAnswers });
    }
  }

  return questions;
}
