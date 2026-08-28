import type { Pillar } from "@prisma/client";

// Exercise Engine — contratos partilhados. Ver docs/12-exercise-engine.md para a
// arquitetura completa. Isto NÃO substitui `Exercise`/`contentJson` (BD) nem os
// módulos de conteúdo estático já existentes — é a camada por cima que os tipos
// de exercício NOVOS usam para falar com progresso/gamificação de forma uniforme.

// Os 20 tipos pedidos pelo utilizador (2026-08-28). `existing` aponta para o
// runner que já cobre esse tipo hoje — usado só para o relatório de estado, não
// pelo código em runtime.
export type ExerciseKind =
  | "multiple_choice"
  | "fill_blank"
  | "word_ordering"
  | "matching"
  | "listen_and_choose"
  | "dictation"
  | "oral_repetition"
  | "read_aloud"
  | "ai_conversation"
  | "error_correction"
  | "translation_pt_en"
  | "translation_en_pt"
  | "context_word_choice"
  | "synonym_antonym"
  | "word_builder"
  | "grammar_topic_quiz"
  | "reading_comprehension"
  | "video_comprehension"
  | "roleplay_simulation"
  | "free_writing_challenge"
  // Não fazia parte da lista original de 20 — acrescentado depois da
  // auditoria de 2026-08-28 (achado crítico S1/S2 de Speaking): nenhum dos
  // tipos existentes levava o utilizador a produzir 45-90s de discurso
  // contínuo e não ensaiado. Ver src/lib/ai/gradeSpeakingChallenge.ts.
  | "extended_speaking";

// Camada de dificuldade DENTRO de um tópico/pilar — combina com o nível CEFR já
// existente (Exercise.cefr), não o substitui. "practice" = com andaimes
// (distratores óbvios, dicas); "challenge" = mesma competência sem andaimes;
// "apply" = produção livre em contexto, não só reconhecimento.
export type DifficultyTier = "learn" | "practice" | "challenge" | "apply";

export interface GradingResult {
  isCorrect: boolean | null; // null = sem correção binária possível (ex. escrita livre, só feedback)
  score: number; // 0-100, o que entra em updateSkillScore
  explanation?: string;
  correctAnswer?: string;
  partialCredit?: boolean;
}

export interface ExerciseResultInput {
  userId: string;
  pillar: Pillar;
  kind: ExerciseKind;
  score: number; // 0-100
  correct: boolean;
  // Para alimentar o SRS/UserError quando o exercício revela um erro
  // recorrente (mesmo padrão já usado em learn/actions.ts) — opcional porque
  // nem todo exercício tem um "erro" nomeável (ex. escrita livre).
  errorSignal?: {
    sourceText: string;
    correction: string;
    errorType: string;
    commonMistakePt?: string;
  };
  achievementCode?: string;
}
