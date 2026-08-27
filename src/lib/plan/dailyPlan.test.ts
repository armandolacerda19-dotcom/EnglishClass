import { describe, expect, it } from "vitest";
import { generateDailyPlan } from "./dailyPlan";

describe("generateDailyPlan", () => {
  it("≤5 minutos: só um micro-desafio, com a duração total", () => {
    const plan = generateDailyPlan(5, false);
    expect(plan).toHaveLength(1);
    expect(plan[0]?.href).toBe("/practice/micro-challenges");
    expect(plan[0]?.minutes).toBe(5);
  });

  it("≤15 minutos sem revisões pendentes: só o tema à escolha, com todo o tempo", () => {
    const plan = generateDailyPlan(15, false);
    expect(plan).toHaveLength(1);
    expect(plan[0]?.href).toBe("/practice/topic");
    expect(plan[0]?.minutes).toBe(15);
  });

  it("≤15 minutos com revisões pendentes: revisão + tema, minutos somam o total", () => {
    const plan = generateDailyPlan(15, true);
    expect(plan).toHaveLength(2);
    expect(plan[0]?.href).toBe("/practice/review");
    const totalMinutes = plan.reduce((sum, item) => sum + item.minutes, 0);
    expect(totalMinutes).toBe(15);
  });

  it("≤30 minutos: inclui sempre o Desafio Diário de vocabulário", () => {
    const plan = generateDailyPlan(30, false);
    expect(plan.some((item) => item.href === "/practice/daily-challenge")).toBe(true);
  });

  it(">30 minutos: inclui sempre uma sessão de speaking (prioridade declarada da app)", () => {
    const plan = generateDailyPlan(45, false);
    expect(plan.some((item) => item.href === "/speak")).toBe(true);
  });

  it("com weakAreas, liga o tema à escolha ao pilar mais fraco (auditoria 2026-08-27, ação #4)", () => {
    const plan = generateDailyPlan(15, false, ["WRITING", "GRAMMAR"]);
    // "WRITING" não tem exercícios discretos em /practice/topic/[pillar] — o
    // primeiro pilar elegível é "GRAMMAR", não o primeiro de weakAreas às cegas.
    expect(plan[0]?.href).toBe("/practice/topic/grammar");
    expect(plan[0]?.label).toContain("gramática");
  });

  it("sem weakAreas elegíveis (só pilares sem /practice/topic/[pillar]), cai no seletor genérico", () => {
    const plan = generateDailyPlan(15, false, ["WRITING", "SPEAKING"]);
    expect(plan[0]?.href).toBe("/practice/topic");
  });

  it("nunca devolve um item com minutos negativos ou zero, mesmo em fronteiras", () => {
    for (const minutes of [1, 5, 6, 15, 16, 30, 31, 60, 120]) {
      for (const hasDueReviews of [true, false]) {
        const plan = generateDailyPlan(minutes, hasDueReviews);
        for (const item of plan) {
          expect(item.minutes).toBeGreaterThan(0);
        }
      }
    }
  });
});
