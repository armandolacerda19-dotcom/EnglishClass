// Escolher pela Palavra Certa (contexto) — tipo de exercício novo (Exercise
// Engine, 2026-08-28). Testa compreensão contextual entre palavras
// facilmente confundíveis, não memorização de vocabulário isolado.

export interface ContextWordChoiceItem {
  id: string;
  level: string;
  sentence: string; // com "___" no lugar da palavra em falta
  options: string[];
  correct: string;
  explanation: string;
}

export const CONTEXT_WORD_CHOICE_ITEMS: ContextWordChoiceItem[] = [
  { id: "cwc-01", level: "A2", sentence: "I am very ___ in learning English.", options: ["interested", "interesting"], correct: "interested", explanation: "\"Interested\" descreve quem sente o interesse; \"interesting\" descreve o que causa interesse." },
  { id: "cwc-02", level: "A2", sentence: "This film is really ___.", options: ["boring", "bored"], correct: "boring", explanation: "\"Boring\" descreve o filme (causa o tédio); \"bored\" descreve quem sente tédio." },
  { id: "cwc-03", level: "A2", sentence: "Can you ___ me the salt, please?", options: ["pass", "spend"], correct: "pass", explanation: "\"Pass\" = entregar algo a alguém; \"spend\" é sobre gastar dinheiro/tempo." },
  { id: "cwc-04", level: "A2", sentence: "I need to ___ some money for the trip.", options: ["save", "keep"], correct: "save", explanation: "\"Save money\" = poupar; \"keep\" é mais genérico (manter/guardar), não a expressão certa para dinheiro." },
  { id: "cwc-05", level: "B1", sentence: "She ___ up early every morning.", options: ["wakes", "raises"], correct: "wakes", explanation: "\"Wake up\" = acordar (intransitivo); \"raise\" precisa de objeto (levantar algo)." },
  { id: "cwc-06", level: "B1", sentence: "He ___ his hand to ask a question.", options: ["raised", "rose"], correct: "raised", explanation: "\"Raise\" (transitivo, levantar algo) vs. \"rise\" (intransitivo, subir sozinho)." },
  { id: "cwc-07", level: "B1", sentence: "I ___ to the gym three times a week.", options: ["go", "come"], correct: "go", explanation: "\"Go\" = ir para um lugar afastado de quem fala; \"come\" implica movimento em direção ao falante." },
  { id: "cwc-08", level: "B1", sentence: "The company will ___ 50 new employees this year.", options: ["hire", "rent"], correct: "hire", explanation: "\"Hire\" = contratar pessoas; \"rent\" = alugar um bem (casa, carro)." },
  { id: "cwc-09", level: "B1", sentence: "I can't ___ with all this noise.", options: ["concentrate", "focus on"], correct: "concentrate", explanation: "\"Concentrate\" sozinho já funciona; \"focus on\" precisaria de um objeto depois de \"on\"." },
  { id: "cwc-10", level: "B1", sentence: "Please ___ the door when you leave.", options: ["close", "shut down"], correct: "close", explanation: "\"Close the door\" é a expressão natural; \"shut down\" usa-se para máquinas/sistemas, não portas." },
  { id: "cwc-11", level: "B2", sentence: "The evidence ___ that he was telling the truth.", options: ["suggests", "suggests to"], correct: "suggests", explanation: "\"Suggest\" é transitivo direto em inglês — nunca leva \"to\" antes do complemento." },
  { id: "cwc-12", level: "B2", sentence: "I ___ my keys somewhere in the house.", options: ["lost", "missed"], correct: "lost", explanation: "\"Lose/lost\" = perder um objeto; \"miss\" = sentir falta de alguém, ou não apanhar (um comboio, uma oportunidade)." },
  { id: "cwc-13", level: "B2", sentence: "She has a lot of ___ in project management.", options: ["experience", "experiment"], correct: "experience", explanation: "\"Experience\" = experiência (prática/conhecimento); \"experiment\" = experiência científica." },
  { id: "cwc-14", level: "B2", sentence: "The manager will ___ the final decision.", options: ["make", "do"], correct: "make", explanation: "\"Make a decision\" é a colocação fixa; \"do\" não se usa com \"decision\"." },
  { id: "cwc-15", level: "B2", sentence: "He ___ his opinion after hearing the facts.", options: ["changed", "exchanged"], correct: "changed", explanation: "\"Change one's opinion\" = mudar de ideias; \"exchange\" implica trocar uma coisa por outra entre duas partes." },
  { id: "cwc-16", level: "C1", sentence: "The results ___ a clear pattern across all groups.", options: ["reveal", "unveil"], correct: "reveal", explanation: "Ambos significam \"revelar\", mas \"reveal\" é o termo natural para dados/resultados; \"unveil\" usa-se sobretudo para produtos/planos anunciados formalmente." },
  { id: "cwc-17", level: "C1", sentence: "It is ___ that the deadline will be extended.", options: ["likely", "probably"], correct: "likely", explanation: "Depois de \"it is\", usa-se o adjetivo \"likely\"; \"probably\" é advérbio e viria antes do verbo (\"it will probably be extended\")." },
  { id: "cwc-18", level: "C1", sentence: "The committee will ___ the proposal next week.", options: ["review", "revise"], correct: "review", explanation: "\"Review\" = analisar/avaliar algo; \"revise\" = alterar/corrigir algo já existente." },
];

export function getContextWordChoiceItem(id: string): ContextWordChoiceItem | undefined {
  return CONTEXT_WORD_CHOICE_ITEMS.find((c) => c.id === id);
}
