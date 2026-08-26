import { anthropic, TUTOR_MODEL } from "./anthropic";

// Scoring de respostas livres (speaking/writing) do placement test — 0-100,
// calibrado à dificuldade CEFR da pergunta. Usado só para posicionamento inicial;
// a correção pedagógica completa acontece no AI Tutor (docs/06-arquitetura-ia.md).
export async function scoreFreeResponse(params: {
  prompt: string;
  learnerResponse: string;
  cefrDifficulty: string;
}): Promise<number> {
  if (!params.learnerResponse.trim()) return 0;

  const message = await anthropic.messages.create({
    model: TUTOR_MODEL,
    max_tokens: 20,
    system:
      "You are grading a single response from an English placement test for an adult Portuguese-speaking " +
      "learner, for the purpose of estimating a CEFR level. Reply with ONLY an integer from 0 to 100 " +
      "representing how well the response demonstrates command of English at or above the target CEFR " +
      "difficulty stated. No words, no explanation, just the number.",
    messages: [
      {
        role: "user",
        content: `Target CEFR difficulty: ${params.cefrDifficulty}\nPrompt: ${params.prompt}\nLearner response: ${params.learnerResponse}`,
      },
    ],
  });

  const text = message.content.find((block) => block.type === "text")?.text ?? "0";
  const parsed = parseInt(text.trim().match(/\d+/)?.[0] ?? "0", 10);
  return Number.isNaN(parsed) ? 0 : Math.max(0, Math.min(100, parsed));
}
