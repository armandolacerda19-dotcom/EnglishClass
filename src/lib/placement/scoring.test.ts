import { describe, expect, it } from "vitest";
import { scorePlacementTest, type PlacementAnswer } from "./scoring";
import { PLACEMENT_QUESTIONS } from "./questions";

// Fase 13 (auditoria 2026-08-27) — antes desta correção, `averageToLevel`
// nunca devolvia nada acima de A2.2, mesmo que todas as respostas (incluindo
// as de dificuldade B1, peso 3) estivessem certas. Estes testes existem
// especificamente para garantir que um utilizador forte a sério chega a B1/B2
// — o bug real que motivou a correção.
function allCorrectAnswers(): PlacementAnswer[] {
  return PLACEMENT_QUESTIONS.map((q) => ({
    questionId: q.id,
    answer: q.correctAnswer,
    aiScore: q.freeResponse ? 100 : undefined,
  }));
}

function noAnswers(): PlacementAnswer[] {
  return [];
}

// Acerta tudo EXCETO as perguntas B2 (nem responde a essas) — simula alguém
// sólido até B1 mas que ainda não domina os pontos só ensinados em B2
// (inversão, "denied doing", cleft sentences...).
function allCorrectExceptB2(): PlacementAnswer[] {
  return PLACEMENT_QUESTIONS.filter((q) => q.difficultyLevel !== "B2").map((q) => ({
    questionId: q.id,
    answer: q.correctAnswer,
    aiScore: q.freeResponse ? 100 : undefined,
  }));
}

describe("scorePlacementTest", () => {
  it("acertar tudo (incluindo as perguntas B1) coloca o utilizador em B1 ou B2, nunca preso em A2", () => {
    const result = scorePlacementTest(allCorrectAnswers());
    expect(["B1", "B2"]).toContain(result.resultLevel);
  });

  it("não responder a nada coloca o utilizador em Pre-A1", () => {
    const result = scorePlacementTest(noAnswers());
    expect(result.resultLevel).toBe("PRE_A1");
    expect(result.resultSublevel).toBe(1);
  });

  it("resultSublevel está sempre dentro do intervalo válido (1 ou 2, exceto Pre-A1/A1 que vão até 3)", () => {
    const result = scorePlacementTest(allCorrectAnswers());
    expect(result.resultSublevel).toBeGreaterThanOrEqual(1);
    expect(result.resultSublevel).toBeLessThanOrEqual(3);
  });

  it("as perguntas B2 discriminam de verdade: acertar tudo até B1 mas errar as B2 coloca em B1, não em B2", () => {
    const result = scorePlacementTest(allCorrectExceptB2());
    expect(result.resultLevel).toBe("B1");
  });
});
