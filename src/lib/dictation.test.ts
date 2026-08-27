import { describe, expect, it } from "vitest";
import { checkDictation } from "./dictation";

// Fase 8 (auditoria 2026-08-27) — checkDictation() é a função que agora
// decide, no SERVIDOR, se uma resposta de ditado está certa (ver
// src/app/(app)/practice/dictation/actions.ts) — um erro aqui afetaria
// diretamente o pilar LISTENING do octógono e o portão do certificado.

describe("checkDictation", () => {
  it("aceita a frase exatamente igual", () => {
    const result = checkDictation("The train had already left.", "The train had already left.");
    expect(result.isCorrect).toBe(true);
  });

  it("ignora maiúsculas/minúsculas", () => {
    const result = checkDictation("the TRAIN had ALREADY left.", "The train had already left.");
    expect(result.isCorrect).toBe(true);
  });

  it("ignora pontuação e espaços extra", () => {
    const result = checkDictation("the train  had already left", "The train had already left.");
    expect(result.isCorrect).toBe(true);
  });

  it("distingue contrações (mantém apóstrofos) — 'doesn't' != 'does not'", () => {
    const result = checkDictation("She does not like coffee.", "She doesn't like coffee.");
    expect(result.isCorrect).toBe(false);
  });

  it("rejeita uma frase claramente diferente", () => {
    const result = checkDictation("I like cats.", "The train had already left.");
    expect(result.isCorrect).toBe(false);
  });

  it("rejeita uma resposta vazia contra uma frase real", () => {
    const result = checkDictation("", "The train had already left.");
    expect(result.isCorrect).toBe(false);
  });

  it("o diff palavra-a-palavra assinala corretamente cada palavra errada", () => {
    const result = checkDictation("The bus had already left.", "The train had already left.");
    expect(result.isCorrect).toBe(false);
    const wrongWords = result.diff.filter((w) => !w.correct).map((w) => w.word);
    expect(wrongWords).toEqual(["train"]);
  });
});
