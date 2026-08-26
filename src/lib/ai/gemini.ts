import { GoogleGenerativeAI } from "@google/generative-ai";

// Google Gemini — nível gratuito permanente (com limites de pedidos/dia),
// escolhido para manter o produto sem custos. Substitui a Anthropic (Claude)
// prevista em docs/06-arquitetura-ia.md — ver docs/decisions.md.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

export const GEMINI_MODEL = "gemini-2.0-flash";

export function getGeminiModel(systemInstruction?: string) {
  return genAI.getGenerativeModel({ model: GEMINI_MODEL, systemInstruction });
}
