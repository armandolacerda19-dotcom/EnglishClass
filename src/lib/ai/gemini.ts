import { GoogleGenerativeAI } from "@google/generative-ai";

// Google Gemini — nível gratuito permanente (com limites de pedidos/dia),
// escolhido para manter o produto sem custos. Substitui a Anthropic (Claude)
// prevista em docs/06-arquitetura-ia.md — ver docs/decisions.md.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

// gemini-2.0-flash foi descontinuado pela Google (erro 404 em produção,
// 2026-09-01, 5ª auditoria) — a própria resposta de erro da API recomendou
// gemini-3.6-flash como substituto. Afetava TODAS as funcionalidades
// avaliadas por IA (Apply do Quiz de Gramática, Desafio de Escrita Livre,
// Desafio de Discurso Livre, Tutor, placement test). Ver docs/decisions.md.
export const GEMINI_MODEL = "gemini-3.6-flash";

// `jsonMode`: força a resposta a ser JSON válido (suportado pelo gemini-2.0-flash
// via responseMimeType) — usado pela avaliação estruturada de conversas
// (Exercise Engine, 2026-08-28), onde extrair várias dimensões por regex de
// texto livre seria muito mais frágil do que já é para SCORE:/PRONUNCIATION:
// numa única linha. Opcional e aditivo: nenhuma chamada existente passa este
// argumento, por isso o comportamento delas não muda.
export function getGeminiModel(systemInstruction?: string, jsonMode = false) {
  return genAI.getGenerativeModel({
    model: GEMINI_MODEL,
    systemInstruction,
    ...(jsonMode ? { generationConfig: { responseMimeType: "application/json" } } : {}),
  });
}
