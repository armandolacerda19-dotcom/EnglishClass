// Preencher Espaços — tipo de exercício novo (Exercise Engine, prioridade 🟡
// do relatório de 2026-08-28). Diferente do "text kind" já usado noutros
// sítios: aqui há dica (`hint`) e revelação parcial letra a letra, pedidas
// explicitamente. Mistura espaços de uma palavra e de expressões completas.

export interface FillBlankItem {
  id: string;
  level: string;
  sentence: string; // com "___" no lugar da(s) palavra(s) em falta
  correct: string[];
  hint: string;
  explanation: string;
}

export const FILL_BLANK_ITEMS: FillBlankItem[] = [
  { id: "fb-01", level: "A1", sentence: "I ___ English every day.", correct: ["study", "practise", "practice"], hint: "Verbo: aprender/treinar uma língua.", explanation: "Present Simple, 1ª pessoa — sem \"-s\"." },
  { id: "fb-02", level: "A1", sentence: "She ___ from Portugal.", correct: ["is"], hint: "Forma do verbo \"to be\" para \"she\".", explanation: "3ª pessoa do singular de \"to be\" é \"is\"." },
  { id: "fb-03", level: "A1", sentence: "There ___ a book on the table.", correct: ["is"], hint: "\"There is\" para singular, \"there are\" para plural.", explanation: "\"A book\" é singular, por isso \"is\", não \"are\"." },
  { id: "fb-04", level: "A2", sentence: "I ___ to the cinema last night.", correct: ["went"], hint: "Passado irregular de \"go\".", explanation: "\"Go\" no passado é \"went\", não \"goed\"." },
  { id: "fb-05", level: "A2", sentence: "He is good ___ playing the guitar.", correct: ["at"], hint: "Preposição fixa depois de \"good\".", explanation: "\"Good at something\" é a colocação fixa em inglês." },
  { id: "fb-06", level: "A2", sentence: "We ___ dinner when the phone rang.", correct: ["were having", "were eating"], hint: "Ação em curso interrompida — Past Continuous.", explanation: "Past Continuous (\"were having\") para uma ação em curso interrompida por outra." },
  { id: "fb-07", level: "B1", sentence: "If it ___ tomorrow, we will stay at home.", correct: ["rains"], hint: "First Conditional — presente na oração com \"if\".", explanation: "Na oração com \"if\" do First Conditional usa-se Present Simple, nunca \"will\"." },
  { id: "fb-08", level: "B1", sentence: "I ___ sushi before last week.", correct: ["had never tried", "had never eaten"], hint: "Past Perfect (\"had never...\") — algo que nunca tinha acontecido antes.", explanation: "Past Perfect (\"had never tried\") para algo que nunca tinha acontecido antes de outro momento passado." },
  { id: "fb-09", level: "B1", sentence: "She asked me ___ I could help her.", correct: ["if", "whether"], hint: "Discurso indireto de uma pergunta de sim/não.", explanation: "Perguntas de sim/não em discurso indireto usam \"if\" ou \"whether\"." },
  { id: "fb-10", level: "B2", sentence: "___ the rain, the match continued.", correct: ["despite", "in spite of"], hint: "Duas palavras/expressão que significam \"apesar de\" + substantivo.", explanation: "\"Despite\"/\"in spite of\" são seguidos diretamente de substantivo, sem \"of\" a mais nem \"that\"." },
  { id: "fb-11", level: "B2", sentence: "The report ___ by the intern yesterday.", correct: ["was written"], hint: "Voz passiva no passado.", explanation: "Voz passiva: \"was\" + particípio passado (\"written\")." },
  { id: "fb-12", level: "B2", sentence: "By the time we arrived, the film ___.", correct: ["had already started", "had started"], hint: "Past Perfect — algo já tinha acontecido antes.", explanation: "Past Perfect para uma ação já concluída antes de outro momento no passado." },
  { id: "fb-13", level: "C1", sentence: "It is essential that she ___ informed immediately.", correct: ["be"], hint: "Subjuntivo — forma base do verbo, sem \"-s\".", explanation: "Depois de \"it is essential that\", usa-se o subjuntivo: forma base \"be\", nunca \"is\"." },
  { id: "fb-14", level: "C1", sentence: "Not until she arrived ___ we start the meeting.", correct: ["did"], hint: "Inversão depois de \"not until\" no início da frase.", explanation: "\"Not until\" no início da frase exige inversão: auxiliar (\"did\") antes do sujeito." },
  { id: "fb-15", level: "C1", sentence: "He is said ___ left the country, though this has never been confirmed.", correct: ["to have"], hint: "Relato passivo com infinitivo perfeito.", explanation: "\"Is said to have left\" — relato passivo sobre um acontecimento anterior, infinitivo perfeito." },
];

export function getFillBlankItem(id: string): FillBlankItem | undefined {
  return FILL_BLANK_ITEMS.find((f) => f.id === id);
}
