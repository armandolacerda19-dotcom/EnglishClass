import { gradeFreeTextAnswer } from "@/lib/ai/gradeAnswer";
import type { GradingResult } from "./types";

// Exercise Engine — primitivas de correção reutilizáveis. Cada uma envolve
// lógica já existente e verificada (nunca reimplementa comparação de texto do
// zero) para que um tipo de exercício novo só escolha qual usar.

// Igualdade exata, insensível a maiúsculas/espaços — para exercícios de
// escolha múltipla e correspondência exata (sinónimos/antónimos, contexto).
export function exactMatchGrade(given: string, accepted: string | string[]): GradingResult {
  const options = Array.isArray(accepted) ? accepted : [accepted];
  const normalized = given.trim().toLowerCase();
  const isCorrect = options.some((o) => o.trim().toLowerCase() === normalized);
  return {
    isCorrect,
    score: isCorrect ? 100 : 20,
    correctAnswer: options[0],
  };
}

// Correção semântica tolerante (IA com fallback para igualdade exata) — para
// tradução nos dois sentidos e correção de erros, onde há mais do que uma
// forma correta de escrever a mesma coisa. Envolve gradeFreeTextAnswer
// (src/lib/ai/gradeAnswer.ts), já com defesas contra prompt injection.
export async function semanticGrade(
  prompt: string,
  referenceAnswers: string[],
  given: string,
  userId: string
): Promise<GradingResult> {
  const isCorrect = await gradeFreeTextAnswer(prompt, referenceAnswers, given, userId);
  return {
    isCorrect,
    score: isCorrect ? 100 : 20,
    correctAnswer: referenceAnswers[0],
  };
}

// Ordem exata de uma sequência (frases construídas por palavras, passos de um
// diálogo) — mesma lógica de checkOrdering (src/lib/sentenceOrdering.ts),
// exposta aqui para outros tipos de exercício (ex. word-builder por passos)
// não terem de reimplementar a comparação posicional.
export function sequenceGrade(given: string[], correctOrder: string[]): GradingResult {
  const isCorrect = given.length === correctOrder.length && given.every((w, i) => w === correctOrder[i]);
  return {
    isCorrect,
    score: isCorrect ? 100 : 20,
    correctAnswer: correctOrder.join(" "),
  };
}

// Percentagem de palavras corretas numa resposta de texto livre comparada
// palavra a palavra com a referência — usado por ditado e, agora, por
// correção de erros quando a resposta é quase certa mas não perfeita (dá nota
// parcial em vez de tudo-ou-nada). Ignora maiúsculas/pontuação, preserva
// apóstrofos (distinguem contrações).
export function wordAccuracyGrade(given: string, reference: string): GradingResult {
  const normalize = (s: string) =>
    s.toLowerCase().replace(/[.,!?;:"]/g, "").replace(/\s+/g, " ").trim();
  const givenWords = normalize(given).split(" ").filter(Boolean);
  const refWords = normalize(reference).split(" ").filter(Boolean);
  const isCorrect = normalize(given) === normalize(reference);

  if (refWords.length === 0) return { isCorrect: false, score: 0 };
  const matches = refWords.filter((w, i) => givenWords[i] === w).length;
  const accuracy = matches / refWords.length;

  return {
    isCorrect,
    score: isCorrect ? 100 : Math.round(20 + accuracy * 60), // nunca 0 — tentativa parcial conta
    correctAnswer: reference,
    partialCredit: !isCorrect && accuracy > 0,
  };
}
