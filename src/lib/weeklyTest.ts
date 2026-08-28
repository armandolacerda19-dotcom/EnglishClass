import type { Pillar } from "@prisma/client";
import { buildQuestionSet, type PracticeQuestion } from "./practiceQuestions";

// Diagnóstico Semanal — pedido do utilizador (crítica de 2026-08-26, prioridade #3):
// "fluência prática, mas com testes que ajudem a corrigir no futuro". Cobre todos os
// pilares com exercícios discretos seedados, incl. TRANSLATION como pergunta de texto
// livre (ver src/lib/practiceQuestions.ts). SPEAKING/WRITING continuam avaliados nas
// lições e no AI Tutor (não há exercícios estruturados desses pilares no seed).

const TESTABLE_PILLARS: Pillar[] = ["GRAMMAR", "VOCABULARY", "LISTENING", "READING", "TRANSLATION"];
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

export type WeeklyTestQuestion = PracticeQuestion;

export async function getWeeklyTest(date: Date = new Date(), userId?: string, userLevel?: string): Promise<WeeklyTestQuestion[]> {
  return buildQuestionSet(TESTABLE_PILLARS, weekSeed(date), PER_PILLAR, userId, userLevel);
}
