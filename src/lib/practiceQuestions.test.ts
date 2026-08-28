import { describe, expect, it } from "vitest";
import { cefrLevelsUpTo } from "./practiceQuestions";

// Fase 13 (auditoria 2026-08-27) — buildQuestionSet passou a filtrar
// exercícios pelo nível do utilizador (nunca acima), para o Diagnóstico
// Semanal e as Sheets de tema deixarem de poder misturar conteúdo B2 na
// seleção de um utilizador Pre-A1. Este teste cobre só a parte pura da
// lógica (a função em si depende do Prisma, sem mock disponível).
describe("cefrLevelsUpTo", () => {
  it("Pre-A1 só inclui Pre-A1", () => {
    expect(cefrLevelsUpTo("PRE_A1")).toEqual(new Set(["PRE_A1"]));
  });

  it("B1 inclui tudo até B1, nunca B2 ou acima", () => {
    const levels = cefrLevelsUpTo("B1");
    expect(levels).toEqual(new Set(["PRE_A1", "A1", "A2", "B1"]));
    expect(levels.has("B2")).toBe(false);
  });

  it("B2 inclui tudo até B2, nunca C1", () => {
    const levels = cefrLevelsUpTo("B2");
    expect(levels.has("B2")).toBe(true);
    expect(levels.has("C1")).toBe(false);
  });

  it("um nível desconhecido (nunca deveria acontecer, mas não deve rebentar) devolve todos os níveis", () => {
    const levels = cefrLevelsUpTo("NOT_A_REAL_LEVEL");
    expect(levels.has("PRE_A1")).toBe(true);
    expect(levels.has("C2")).toBe(true);
  });
});
