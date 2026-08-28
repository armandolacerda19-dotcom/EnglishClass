import type { Pillar } from "@prisma/client";
import type { DifficultyTier, ExerciseKind } from "./types";

// Exercise Engine — adaptive learning. Desenho deliberadamente baseado em
// regras claras, não um modelo de ML: esta é uma app pessoal/familiar, não
// uma plataforma com milhões de eventos para treinar um modelo — um sistema
// de regras é a escolha honesta e proporcionada. Ver docs/12-exercise-engine.md.

const KINDS_BY_PILLAR: Record<Pillar, ExerciseKind[]> = {
  GRAMMAR: ["multiple_choice", "fill_blank", "error_correction", "grammar_topic_quiz", "word_ordering"],
  VOCABULARY: ["matching", "synonym_antonym", "word_builder", "context_word_choice", "multiple_choice"],
  LISTENING: ["listen_and_choose", "dictation"],
  READING: ["reading_comprehension"],
  TRANSLATION: ["translation_pt_en", "translation_en_pt"],
  SPEAKING: ["oral_repetition", "roleplay_simulation", "ai_conversation"],
  WRITING: ["free_writing_challenge"],
  PRONUNCIATION: ["read_aloud", "oral_repetition"],
};

export interface SkillSnapshot {
  pillar: Pillar;
  score: number; // 0-100, LearningProfile.*Score
}

export interface RecommendationInput {
  skills: SkillSnapshot[];
  weakAreas: Pillar[];
  dueReviewCount: number;
  recentKinds: ExerciseKind[]; // últimos tipos já feitos nesta sessão/dia — evita repetir
}

export interface Recommendation {
  pillar: Pillar;
  tier: DifficultyTier;
  kind: ExerciseKind;
  reason: string;
}

// >0 revisões pendentes: recomenda sempre rever primeiro — é o mecanismo já
// existente (SRS) a fazer o que já faz bem, o motor novo só respeita a ordem.
export function shouldReviewFirst(dueReviewCount: number): boolean {
  return dueReviewCount > 0;
}

function tierForScore(score: number): DifficultyTier {
  if (score < 50) return "practice"; // com andaimes — ainda a consolidar
  if (score < 80) return "challenge"; // sem andaimes, mesma competência
  return "apply"; // produção livre em contexto
}

// Escolhe o pilar mais fraco entre os disponíveis (weakAreas já vem ordenado
// por recalculateAreas em skillProfile.ts), com fallback para o de menor
// score bruto se weakAreas estiver vazio (perfil muito novo, sem sinal
// suficiente para calcular desvio face à média).
function pickPillar(input: RecommendationInput): Pillar {
  if (input.weakAreas.length > 0) return input.weakAreas[0]!;
  const sorted = [...input.skills].sort((a, b) => a.score - b.score);
  return sorted[0]?.pillar ?? "GRAMMAR";
}

export function recommendNextActivity(input: RecommendationInput): Recommendation {
  const pillar = pickPillar(input);
  const skill = input.skills.find((s) => s.pillar === pillar);
  const tier = tierForScore(skill?.score ?? 0);

  const available = KINDS_BY_PILLAR[pillar] ?? ["multiple_choice"];
  // Roda para o primeiro tipo disponível que não esteve entre os últimos 2
  // feitos — variedade de interação, não só de conteúdo (pedido explícito do
  // utilizador: "não deve fazer o utilizador sentir que está constantemente a
  // responder ao mesmo tipo de pergunta").
  const recent = new Set(input.recentKinds.slice(-2));
  const kind = available.find((k) => !recent.has(k)) ?? available[0]!;

  return {
    pillar,
    tier,
    kind,
    reason:
      tier === "practice"
        ? `${pillar} ainda em consolidação — reforço com apoio.`
        : tier === "challenge"
        ? `${pillar} em progresso — hora de tirar os andaimes.`
        : `${pillar} sólido — praticar em uso livre, não só reconhecimento.`,
  };
}
