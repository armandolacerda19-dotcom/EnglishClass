import { getGeminiModel } from "@/lib/ai/gemini";

// Correção tolerante para respostas de texto livre (sobretudo tradução) — o
// exercício só tem UMA frase de referência, mas há muitas traduções válidas em
// inglês para a mesma frase em português. Comparar por igualdade exata (como
// os exercícios de escolha múltipla) penaliza injustamente respostas corretas
// com fraseado diferente. Pede ao Gemini uma classificação binária simples
// (mais barato/rápido do que feedback holístico); cai para igualdade exata se
// a IA falhar ou já houver correspondência exata.
export async function gradeFreeTextAnswer(
  prompt: string,
  referenceAnswers: string[],
  given: string
): Promise<boolean> {
  if (!given.trim()) return false;

  const exactMatch = referenceAnswers.some((r) => r.trim().toLowerCase() === given.trim().toLowerCase());
  if (exactMatch) return true;
  if (referenceAnswers.length === 0) return false;

  try {
    const model = getGeminiModel(
      "You are grading a single short answer from an adult Portuguese-speaking English learner. " +
        "Decide if the learner's answer is an acceptable, correct answer to the prompt — accept valid " +
        "alternative phrasings and translations, synonyms, and minor punctuation/capitalization differences, " +
        "but reject answers that are grammatically wrong or change the meaning. " +
        "Reply with exactly one word: YES or NO."
    );
    const result = await model.generateContent(
      `Prompt: ${prompt}\nReference answer: ${referenceAnswers[0]}\nLearner's answer: ${given}`
    );
    const verdict = result.response.text().trim().toUpperCase();
    return verdict.startsWith("YES");
  } catch (error) {
    console.error("Gemini grading failed, falling back to exact match", error);
    return exactMatch;
  }
}
