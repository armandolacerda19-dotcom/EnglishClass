import { prisma } from "@/lib/prisma";
import { cefrLevelsUpTo } from "@/lib/practiceQuestions";

// Emparelhar — 2º tipo de exercício novo desta ronda (pedido do utilizador,
// 2026-08-28). Ao contrário de Ordenar Frases (sintaxe), este testa
// vocabulário com um mecanismo diferente de tudo o resto na app: escolha
// múltipla testa reconhecimento contra distratores, aqui não há distratores
// nenhuns — o utilizador tem de emparelhar cada palavra inglesa com a sua
// tradução, entre várias igualmente "corretas" à primeira vista. Reaproveita
// diretamente os 1.923 headwords já em `VocabularyItem` (nenhum conteúdo
// novo a escrever/validar) em vez de inventar outro banco estático.

export interface MatchingPair {
  itemId: string;
  headword: string;
  translationPt: string;
}

const SET_SIZE = 6;

export async function getMatchingSet(userLevel?: string): Promise<MatchingPair[]> {
  // Mesmo padrão de buildQuestionSet (practiceQuestions.ts): busca tudo e
  // filtra/baralha em memória com `cefrLevelsUpTo` (Set.has), em vez de um
  // filtro `cefr: { in: [...] }` no Postgres — evita duplicar a conversão
  // enum/string e mantém as duas seleções de conteúdo com o mesmo critério.
  const allWords = await prisma.vocabularyItem.findMany({ select: { id: true, headword: true, translationPt: true, cefr: true } });
  const allowedLevels = userLevel ? cefrLevelsUpTo(userLevel) : null;
  const atLevel = allowedLevels ? allWords.filter((v) => allowedLevels.has(v.cefr)) : allWords;

  // Sem palavras ao nível do utilizador (perfil muito novo, ou nível acima
  // de tudo o que existe seedado): recua para todo o banco, em vez de
  // mostrar um ecrã vazio — mesma lógica de recuo de buildQuestionSet.
  const pool = atLevel.length >= SET_SIZE ? atLevel : allWords;
  if (pool.length === 0) return [];

  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(SET_SIZE, shuffled.length)).map(({ id, headword, translationPt }) => ({
    itemId: id,
    headword,
    translationPt,
  }));
}
