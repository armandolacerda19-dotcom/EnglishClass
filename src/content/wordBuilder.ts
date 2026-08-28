// Word Builder — tipo de exercício novo (Exercise Engine, prioridade 🔴 do
// relatório de 2026-08-28). Trabalha prefixos/sufixos e formação de
// palavras: dada uma palavra-base e uma frase com um espaço, o utilizador
// escreve a forma derivada correta (substantivo/adjetivo/advérbio/negação).

export interface WordBuilderItem {
  id: string;
  level: string;
  base: string;
  basePos: string; // classe gramatical da palavra-base, em português
  targetPos: string; // classe gramatical pedida, em português
  sentence: string; // com "___" no lugar da palavra derivada
  correct: string;
  rule: string;
}

export const WORD_BUILDER_ITEMS: WordBuilderItem[] = [
  { id: "wb-01", level: "A2", base: "happy", basePos: "adjetivo", targetPos: "substantivo", sentence: "Money can't buy ___.", correct: "happiness", rule: "adjetivo + \"-ness\" = substantivo (happy → happiness)." },
  { id: "wb-02", level: "A2", base: "kind", basePos: "adjetivo", targetPos: "substantivo", sentence: "Thank you for your ___.", correct: "kindness", rule: "adjetivo + \"-ness\" = substantivo (kind → kindness)." },
  { id: "wb-03", level: "A2", base: "care", basePos: "substantivo", targetPos: "adjetivo", sentence: "She is a very ___ driver.", correct: "careful", rule: "substantivo + \"-ful\" = adjetivo, \"cheio de\" (care → careful)." },
  { id: "wb-04", level: "A2", base: "care", basePos: "substantivo", targetPos: "adjetivo (negativo)", sentence: "He was ___ with the glasses and broke two.", correct: "careless", rule: "substantivo + \"-less\" = adjetivo, \"sem\" (care → careless), o oposto de \"-ful\"." },
  { id: "wb-05", level: "B1", base: "decide", basePos: "verbo", targetPos: "substantivo", sentence: "It was a difficult ___ to make.", correct: "decision", rule: "verbo + \"-sion\" = substantivo (decide → decision)." },
  { id: "wb-06", level: "B1", base: "possible", basePos: "adjetivo", targetPos: "adjetivo (negativo)", sentence: "It's ___ to finish this today.", correct: "impossible", rule: "prefixo \"im-\" nega adjetivos que começam por \"p\"/\"m\"/\"b\" (possible → impossible)." },
  { id: "wb-07", level: "B1", base: "agree", basePos: "verbo", targetPos: "substantivo", sentence: "They signed the ___ yesterday.", correct: "agreement", rule: "verbo + \"-ment\" = substantivo (agree → agreement)." },
  { id: "wb-08", level: "B1", base: "act", basePos: "verbo", targetPos: "substantivo (pessoa)", sentence: "She's a famous ___.", correct: "actor", rule: "verbo + \"-or\" = a pessoa que faz a ação (act → actor)." },
  { id: "wb-09", level: "B1", base: "differ", basePos: "verbo", targetPos: "substantivo", sentence: "There's a big ___ between the two options.", correct: "difference", rule: "verbo + \"-ence\" = substantivo (differ → difference)." },
  { id: "wb-10", level: "B1", base: "appear", basePos: "verbo", targetPos: "substantivo", sentence: "Her sudden ___ surprised everyone.", correct: "appearance", rule: "verbo + \"-ance\" = substantivo (appear → appearance)." },
  { id: "wb-11", level: "B1", base: "legal", basePos: "adjetivo", targetPos: "adjetivo (negativo)", sentence: "Parking here is ___.", correct: "illegal", rule: "prefixo \"il-\" nega adjetivos que começam por \"l\" (legal → illegal)." },
  { id: "wb-12", level: "B1", base: "regular", basePos: "adjetivo", targetPos: "adjetivo (negativo)", sentence: "His sleeping pattern is quite ___.", correct: "irregular", rule: "prefixo \"ir-\" nega adjetivos que começam por \"r\" (regular → irregular)." },
  { id: "wb-13", level: "B1", base: "responsible", basePos: "adjetivo", targetPos: "adjetivo (negativo)", sentence: "It was ___ of him to drive so fast.", correct: "irresponsible", rule: "prefixo \"ir-\" nega adjetivos que começam por \"r\" (responsible → irresponsible)." },
  { id: "wb-14", level: "B2", base: "appoint", basePos: "verbo", targetPos: "substantivo (voltar a fazer)", sentence: "We need to ___ the meeting for next week.", correct: "reappoint", rule: "prefixo \"re-\" = repetir a ação (appoint → reappoint, marcar de novo)." },
  { id: "wb-15", level: "B2", base: "logic", basePos: "substantivo", targetPos: "adjetivo (negativo)", sentence: "That argument is completely ___.", correct: "illogical", rule: "\"il-\" (para palavras começadas por \"l\") + \"-al\" (substantivo→adjetivo): logic → logical → illogical." },
  { id: "wb-16", level: "B2", base: "globe", basePos: "substantivo", targetPos: "adjetivo", sentence: "Climate change is a ___ problem.", correct: "global", rule: "substantivo + \"-al\" = adjetivo relacionado (globe → global)." },
  { id: "wb-17", level: "B2", base: "critic", basePos: "substantivo", targetPos: "advérbio", sentence: "He responded ___ to the proposal.", correct: "critically", rule: "\"-al\" (substantivo→adjetivo) + \"-ly\" (adjetivo→advérbio): critic → critical → critically." },
  { id: "wb-18", level: "C1", base: "please", basePos: "verbo", targetPos: "adjetivo (negativo)", sentence: "The smell in the kitchen was quite ___.", correct: "unpleasant", rule: "\"un-\" nega o adjetivo derivado \"pleasant\" (please → pleasant → unpleasant)." },
  { id: "wb-19", level: "C1", base: "employ", basePos: "verbo", targetPos: "substantivo (situação)", sentence: "The region has high rates of ___.", correct: "unemployment", rule: "\"un-\" (negação) + \"-ment\" (verbo→substantivo): employ → employment → unemployment." },
  { id: "wb-20", level: "C1", base: "wide", basePos: "adjetivo", targetPos: "verbo", sentence: "The city plans to ___ this road next year.", correct: "widen", rule: "adjetivo + \"-en\" = verbo, \"tornar mais\" (wide → widen)." },
];

export function getWordBuilderItem(id: string): WordBuilderItem | undefined {
  return WORD_BUILDER_ITEMS.find((w) => w.id === id);
}
