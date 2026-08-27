// Idiomas e phrasal verbs — item #3 da lista de melhorias (feature dedicada,
// distinta de "related_forms" mostrado no Desafio Diário/Revisão). É o que
// separa "correto" de "soa nativo" — sinalizado como alto impacto na crítica
// de produto original.

export interface Idiom {
  id: string;
  phrase: string;
  literalPt: string; // tradução literal, palavra a palavra — mostra porque confunde
  meaningEn: string;
  meaningPt: string;
  example: string;
  distractors: string[]; // outros significados plausíveis, para a escolha múltipla
}

export const IDIOMS: Idiom[] = [
  {
    id: "break-the-ice",
    phrase: "break the ice",
    literalPt: "quebrar o gelo",
    meaningEn: "to say or do something to ease tension and start a conversation",
    meaningPt: "fazer algo para aliviar a tensão e começar uma conversa",
    example: "He told a joke to break the ice before the meeting started.",
    distractors: ["to end a friendship suddenly", "to arrive somewhere very late", "to make a serious mistake"],
  },
  {
    id: "hit-the-books",
    phrase: "hit the books",
    literalPt: "bater nos livros",
    meaningEn: "to study hard, especially before an exam",
    meaningPt: "estudar a sério, especialmente antes de um exame",
    example: "I can't go out tonight — I need to hit the books for tomorrow's test.",
    distractors: ["to throw books away", "to read for fun", "to write a book"],
  },
  {
    id: "under-the-weather",
    phrase: "under the weather",
    literalPt: "debaixo do tempo",
    meaningEn: "feeling slightly ill",
    meaningPt: "sentir-se um pouco doente",
    example: "I'm feeling a bit under the weather, so I'm going to stay home today.",
    distractors: ["extremely happy", "very busy at work", "worried about the future"],
  },
  {
    id: "give-up",
    phrase: "give up",
    literalPt: "dar para cima",
    meaningEn: "to stop trying to do something",
    meaningPt: "desistir de tentar fazer algo",
    example: "Don't give up — you're almost finished with the course.",
    distractors: ["to donate something to charity", "to celebrate a success", "to start something new"],
  },
  {
    id: "look-forward-to",
    phrase: "look forward to",
    literalPt: "olhar para a frente para",
    meaningEn: "to feel excited about something that is going to happen",
    meaningPt: "estar entusiasmado com algo que vai acontecer",
    example: "I'm really looking forward to the weekend.",
    distractors: ["to feel nervous about something", "to remember something from the past", "to plan a trip"],
  },
  {
    id: "get-along-with",
    phrase: "get along with",
    literalPt: "ir ao longo com",
    meaningEn: "to have a good, friendly relationship with someone",
    meaningPt: "ter uma boa relação, amigável, com alguém",
    example: "She gets along with all of her coworkers.",
    distractors: ["to compete against someone", "to avoid someone completely", "to work faster than someone"],
  },
  {
    id: "run-out-of",
    phrase: "run out of",
    literalPt: "correr para fora de",
    meaningEn: "to have no more of something left",
    meaningPt: "ficar sem algo — não sobrar mais nada",
    example: "We ran out of coffee, so I need to buy more.",
    distractors: ["to run somewhere quickly", "to organize something", "to escape from a place"],
  },
  {
    id: "piece-of-cake",
    phrase: "a piece of cake",
    literalPt: "um pedaço de bolo",
    meaningEn: "something very easy to do",
    meaningPt: "algo muito fácil de fazer",
    example: "Don't worry about the test — it's a piece of cake.",
    distractors: ["a small mistake", "a difficult decision", "a special celebration"],
  },
];

function dailySeed(date: Date) {
  const key = date.toISOString().slice(0, 10) + "-idiom";
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

// Determinístico por dia — mesmo idioma para todos os utilizadores no mesmo dia,
// mesmo padrão de src/lib/dailyChallenge.ts.
export function getIdiomOfTheDay(date: Date = new Date()): Idiom {
  const seed = dailySeed(date);
  return IDIOMS[seed % IDIOMS.length]!;
}
