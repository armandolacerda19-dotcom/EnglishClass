import type { Goal } from "@prisma/client";

// Fase 12 (auditoria 2026-08-27, "reintroduzir o porquê do onboarding nos
// momentos de progresso") — mesmas frases de src/components/onboarding/
// OnboardingWizard.tsx, duplicadas aqui (minúsculas, para caber numa frase
// tipo "para {motivo}") em vez de extraídas para um sítio partilhado: o
// wizard é client-only e já está verificado a funcionar, não vale a pena
// arriscar mexer nele sem build local só para não repetir 8 strings curtas.
export const GOAL_LABEL: Record<Goal, string> = {
  TRAVEL: "viajar com confiança",
  WORK: "trabalhar em inglês no dia a dia",
  INTERVIEW: "preparar uma entrevista",
  PROMOTION: "preparar uma promoção",
  RELOCATION: "mudar de país",
  MEETINGS: "ter reuniões e apresentações em inglês",
  EXAM: "preparar um exame",
  GENERAL: "melhorar de forma geral",
};
