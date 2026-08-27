"use server";

import { requireUser } from "@/lib/session";
import type { Pillar } from "@prisma/client";
import { recordActivity } from "@/lib/gamification/recordActivity";
import { updateSkillScore } from "@/lib/skillProfile";
import { gradeAnswersOnServer } from "@/app/(app)/practice/gradeSubmission";

const VALID_PILLARS = new Set<string>([
  "GRAMMAR",
  "VOCABULARY",
  "LISTENING",
  "SPEAKING",
  "PRONUNCIATION",
  "READING",
  "WRITING",
  "TRANSLATION",
]);
const MAX_ANSWERS = 50; // a sessão tem 8 perguntas; 50 é folga generosa

export interface TopicPracticeAnswer {
  exerciseId: string;
  given: string; // resposta em bruto — o servidor corrige, nunca confia no cliente
}

export interface TopicPracticeResult {
  correct: number;
  total: number;
}

// Sessão de prática por tema (sem gate semanal, ao contrário do Diagnóstico) —
// atualiza só o score do pilar escolhido, sem criar AssessmentResult (isso fica
// reservado para o Diagnóstico Semanal, para não poluir os checkpoints).
export async function submitTopicPractice(pillar: Pillar, answers: TopicPracticeAnswer[]): Promise<TopicPracticeResult> {
  const user = await requireUser();

  if (!VALID_PILLARS.has(pillar as unknown as string)) throw new Error("Pilar inválido.");
  if (!Array.isArray(answers)) throw new Error("Formato de respostas inválido.");

  const safeAnswers = answers
    .slice(0, MAX_ANSWERS)
    .filter((a) => a && typeof a.exerciseId === "string" && typeof a.given === "string");

  // Correção autoritativa no servidor — ver gradeSubmission.ts.
  const graded = await gradeAnswersOnServer(safeAnswers, user.id);

  // Fase 8 (auditoria 2026-08-27, achado N5): `pillar` aqui é escolhido pelo
  // cliente (vem da rota /practice/topic/[pillar]) e decide em que eixo do
  // octógono o resultado entra — por isso só CONTAM as respostas cujo
  // exercício real (devolvido por gradeAnswersOnServer) pertence mesmo a
  // esse pilar. Sem isto, submeter a resposta certa de um exercício fácil
  // de outro pilar, com `pillar` trocado, inflacionava um eixo à escolha.
  const matching = safeAnswers.filter((a) => graded.get(a.exerciseId)?.pillar === pillar);
  const correct = matching.filter((a) => graded.get(a.exerciseId)?.isCorrect).length;

  // Uma única chamada agregada em vez de uma por pergunta: antes disto, uma
  // sessão de 8 perguntas fazia 8 × recordActivity (16 idas à base de dados) e
  // reescrevia o streak 8 vezes com o mesmo valor.
  if (matching.length > 0) {
    await recordActivity(user.id, correct > matching.length / 2 ? "EXERCISE_CORRECT" : "EXERCISE_INCORRECT");
    await updateSkillScore(user.id, pillar, Math.round((correct / matching.length) * 100));
  }

  return { correct, total: matching.length };
}
