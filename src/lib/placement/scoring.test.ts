import { describe, expect, it } from "vitest";
import { scorePlacementTest, type PlacementAnswer } from "./scoring";
import { PLACEMENT_QUESTIONS } from "./questions";

// Fase 13 (auditoria 2026-08-27) — antes desta correção, `averageToLevel`
// nunca devolvia nada acima de A2.2, mesmo que todas as respostas (incluindo
// as de dificuldade B1, peso 3) estivessem certas. Estes testes existem
// especificamente para garantir que um utilizador forte a sério chega a
// B1/B2/C1/C2 — o bug real que motivou a correção, e que se repetiria um
// nível acima a cada nível novo introduzido se não fosse verificado outra vez.
//
// Fase 18 (2026-08-28, introdução de C2): "C2" tinha ficado de fora deste
// array — como `DIFFICULTY_ORDER.indexOf("C2")` devolve -1, e -1 <= qualquer
// maxIndex é sempre verdadeiro, `allCorrectUpTo(qualquer coisa)` estava a
// incluir SEMPRE as perguntas C2 como respondidas corretamente,
// independentemente do nível pedido — haveria colisão silenciosa com os
// testes de "até B1"/"até B2" abaixo. Corrigido ao acrescentar "C2" aqui.
const DIFFICULTY_ORDER = ["PRE_A1", "A1", "A2", "B1", "B2", "C1", "C2"] as const;

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

// Acerta tudo até `maxLevel` (inclusive) e não responde a nada acima disso —
// simula alguém sólido até um certo nível, mas que ainda não domina os
// pontos só ensinados no(s) nível(is) seguinte(s).
function allCorrectUpTo(maxLevel: (typeof DIFFICULTY_ORDER)[number]): PlacementAnswer[] {
  const maxIndex = DIFFICULTY_ORDER.indexOf(maxLevel);
  return PLACEMENT_QUESTIONS.filter((q) => DIFFICULTY_ORDER.indexOf(q.difficultyLevel as any) <= maxIndex).map(
    (q) => ({
      questionId: q.id,
      answer: q.correctAnswer,
      aiScore: q.freeResponse ? 100 : undefined,
    })
  );
}

describe("scorePlacementTest", () => {
  it("acertar tudo (incluindo as perguntas C2) coloca o utilizador em B1 ou acima, nunca preso em A2", () => {
    const result = scorePlacementTest(allCorrectAnswers());
    expect(["B1", "B2", "C1", "C2"]).toContain(result.resultLevel);
  });

  it("acertar tudo coloca o utilizador exatamente em C2 (o novo teto do currículo)", () => {
    const result = scorePlacementTest(allCorrectAnswers());
    expect(result.resultLevel).toBe("C2");
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

  it("as perguntas B2 discriminam de verdade: acertar tudo até B1 mas não responder B2/C1/C2 coloca em B1, não acima", () => {
    const result = scorePlacementTest(allCorrectUpTo("B1"));
    expect(result.resultLevel).toBe("B1");
  });

  it("as perguntas C1 discriminam de verdade: acertar tudo até B2 mas não responder C1/C2 coloca em B2, não acima", () => {
    const result = scorePlacementTest(allCorrectUpTo("B2"));
    expect(result.resultLevel).toBe("B2");
  });

  // Fase 18 (2026-08-28) — mesmo cuidado repetido ao introduzir C2: garantir
  // que as perguntas C2 novas discriminam de verdade um utilizador C1 forte
  // de um C2 a sério, e que não reintroduzem o bug do teto um nível acima.
  it("as perguntas C2 discriminam de verdade: acertar tudo até C1 mas não responder C2 coloca em C1, não em C2", () => {
    const result = scorePlacementTest(allCorrectUpTo("C1"));
    expect(result.resultLevel).toBe("C1");
  });
});
