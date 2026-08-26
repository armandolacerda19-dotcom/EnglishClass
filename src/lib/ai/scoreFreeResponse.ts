import { getGeminiModel } from "./gemini";

// Scoring de respostas livres (speaking/writing) do placement test — 0-100,
// calibrado à dificuldade CEFR da pergunta. Usado só para posicionamento inicial;
// a correção pedagógica completa acontece no AI Tutor (docs/06-arquitetura-ia.md).
export async function scoreFreeResponse(params: {
  prompt: string;
  learnerResponse: string;
  cefrDifficulty: string;
}): Promise<number> {
  if (!params.learnerResponse.trim()) return 0;

  try {
    const model = getGeminiModel(
      "You are grading a single response from an English placement test for an adult Portuguese-speaking " +
        "learner, for the purpose of estimating a CEFR level. Reply with ONLY an integer from 0 to 100 " +
        "representing how well the response demonstrates command of English at or above the target CEFR " +
        "difficulty stated. No words, no explanation, just the number."
    );

    const result = await model.generateContent(
      `Target CEFR difficulty: ${params.cefrDifficulty}\nPrompt: ${params.prompt}\nLearner response: ${params.learnerResponse}`
    );

    const text = result.response.text();
    const parsed = parseInt(text.trim().match(/\d+/)?.[0] ?? "0", 10);
    return Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
  } catch (error) {
    console.error("Gemini scoring request failed", error);
    return 0;
  }
}
