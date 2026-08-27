"use client";

import { createContext, useContext } from "react";

export type EnglishVariant = "BRITISH" | "AMERICAN" | "INTERNATIONAL";

// Fase 9 (auditoria 2026-08-27, achado C: "LearningProfile.englishVariant
// existe... nunca é consultado pelo TTS" — toda a gente ouvia sempre a mesma
// voz americana, independentemente da preferência escolhida no onboarding).
// Contexto em vez de prop-drilling: PlayTranscript é usado em 11 sítios
// diferentes da app, a maioria sem acesso direto a LearningProfile — um
// Provider único no layout de (app) evita alterar todos esses call sites.
// Nunca gera áudio novo nem tem custo — só escolhe, de entre as vozes que o
// próprio browser já tem instaladas, a que corresponde melhor ao sotaque
// pedido. Ver src/components/ui/PlayTranscript.tsx.
const EnglishVariantContext = createContext<EnglishVariant>("INTERNATIONAL");

export function EnglishVariantProvider({ value, children }: { value: EnglishVariant; children: React.ReactNode }) {
  return <EnglishVariantContext.Provider value={value}>{children}</EnglishVariantContext.Provider>;
}

export function useEnglishVariant(): EnglishVariant {
  return useContext(EnglishVariantContext);
}
