import { prisma } from "@/lib/prisma";
import type { Pillar } from "@prisma/client";

// Diagnóstico Semanal — pedido do utilizador (crítica de 2026-08-26, prioridade #3):
// "fluência prática, mas com testes que ajudem a corrigir no futuro". Reutiliza os
// exercícios já seedados (Exercise.contentJson) em vez de gerar conteúdo novo — cobre
// os pilares com exercícios de escolha múltipla e distratores reais: GRAMMAR,
// VOCABULARY, LISTENING, READING. TRANSLATION/SPEAKING/WRITING/PRONUNCIATION continuam
// avaliados nas lições e no AI Tutor (dependem de correção livre por IA, não de MC).

const TESTABLE_PILLARS: Pillar[] = ["GRAMMAR", "VOCABULARY", "LISTENING", "READING"];
const PER_PILLAR = 2;

function weekSeed(date: Date) {
  // Semana ISO (ano+semana) — mesmo conjunto de exercícios para todos os
  // utilizadores durante a mesma semana, para ser reproduzível ao recarregar.
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  const key = `${d.getUTCFullYear()}-W${week}`;
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

function seededPick<T>(items: T[], seed: number, count: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    const tmp = arr[i]!;
    arr[i] = arr[j]!;
    arr[j] = tmp;
  }
  return arr.slice(0, count);
}

export interface WeeklyTestQuestion {
  exerciseId: string;
  pillar: Pillar;
  prompt: string;
  options: string[]; // resposta correta + distratores, baralhados
}

export async function getWeeklyTest(date: Date = new Date()): Promise<WeeklyTestQuestion[]> {
  const seed = weekSeed(date);
  const questions: WeeklyTestQuestion[] = [];

  for (const pillar of TESTABLE_PILLARS) {
    const exercises = await prisma.exercise.findMany({ where: { pillar }, orderBy: { id: "asc" } });
    if (exercises.length === 0) continue;

    const picked = seededPick(exercises, seed + pillar.length * 97, Math.min(PER_PILLAR, exercises.length));
    for (const ex of picked) {
      const content = ex.contentJson as any;
      const correct = (content.correct_answer as string[])[0];
      if (!correct) continue;
      const distractors = (content.distractors as string[]) ?? [];
      const options = seededPick([correct, ...distractors], seed + ex.id.length, Math.min(4, distractors.length + 1));
      questions.push({ exerciseId: ex.id, pillar, prompt: content.prompt as string, options });
    }
  }

  return questions;
}
