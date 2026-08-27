import { describe, expect, it } from "vitest";
import { sm2Next, type Sm2State } from "./sm2";

// Fase 8 (auditoria 2026-08-27) — SRS era o ponto mais forte do produto
// (8/10 na auditoria original) mas nunca tinha um teste automático a
// proteger o algoritmo de uma regressão silenciosa. Estes testes fixam o
// comportamento documentado no código-fonte (sm2.ts), não reinventam a
// especificação SM-2 original.

const NEW_ITEM: Sm2State = { intervalDays: 1, easeFactor: 2.5, repetitions: 0 };

describe("sm2Next", () => {
  it("falhar (quality < 3) reinicia repetitions e intervalDays para 1, mas preserva o easeFactor", () => {
    const state: Sm2State = { intervalDays: 20, easeFactor: 2.1, repetitions: 4 };
    const result = sm2Next(state, 1, new Date("2026-01-01T00:00:00Z"));

    expect(result.repetitions).toBe(0);
    expect(result.intervalDays).toBe(1);
    expect(result.easeFactor).toBe(2.1); // falhar não deve ser punitivo além de reiniciar o intervalo
    expect(result.dueAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("primeira repetição bem-sucedida (repetitions 0→1) agenda para amanhã", () => {
    const result = sm2Next(NEW_ITEM, 5, new Date("2026-01-01T00:00:00Z"));
    expect(result.repetitions).toBe(1);
    expect(result.intervalDays).toBe(1);
    expect(result.dueAt.toISOString()).toBe("2026-01-02T00:00:00.000Z");
  });

  it("segunda repetição bem-sucedida (repetitions 1→2) agenda para daqui a 6 dias", () => {
    const afterFirst = sm2Next(NEW_ITEM, 5, new Date("2026-01-01T00:00:00Z"));
    const result = sm2Next(afterFirst, 5, new Date("2026-01-02T00:00:00Z"));
    expect(result.repetitions).toBe(2);
    expect(result.intervalDays).toBe(6);
  });

  it("a partir da terceira repetição, o intervalo cresce por intervalDays * easeFactor", () => {
    let state = NEW_ITEM;
    state = sm2Next(state, 5, new Date("2026-01-01T00:00:00Z")); // rep 1, interval 1
    state = sm2Next(state, 5, new Date("2026-01-02T00:00:00Z")); // rep 2, interval 6
    const result = sm2Next(state, 5, new Date("2026-01-08T00:00:00Z")); // rep 3
    expect(result.repetitions).toBe(3);
    expect(result.intervalDays).toBe(Math.round(6 * state.easeFactor));
  });

  it("easeFactor nunca desce abaixo de 1.3, mesmo com quality repetidamente baixa (mas >=3)", () => {
    let state: Sm2State = { intervalDays: 1, easeFactor: 1.35, repetitions: 5 };
    for (let i = 0; i < 10; i++) {
      state = sm2Next(state, 3, new Date("2026-01-01T00:00:00Z"));
    }
    expect(state.easeFactor).toBeGreaterThanOrEqual(1.3);
  });

  it("quality fora de 0-5 é fixada (clamped) antes de ser usada", () => {
    const tooHigh = sm2Next(NEW_ITEM, 99, new Date("2026-01-01T00:00:00Z"));
    const tooLow = sm2Next(NEW_ITEM, -10, new Date("2026-01-01T00:00:00Z"));
    // quality=99 clampado para 5 (sucesso, avança repetitions); quality=-10
    // clampado para 0 (falha, reinicia).
    expect(tooHigh.repetitions).toBe(1);
    expect(tooLow.repetitions).toBe(0);
    expect(tooLow.intervalDays).toBe(1);
  });

  it("quality=3 (limiar de sucesso) conta como acerto, não como falha", () => {
    const result = sm2Next(NEW_ITEM, 3, new Date("2026-01-01T00:00:00Z"));
    expect(result.repetitions).toBe(1);
  });
});
