// Verbos irregulares — item "verbos" pedido explicitamente pelo utilizador
// (2026-08-26): "deve investir em conteúdo de gramática, verbos, construção
// frásica, vocabulário". Referência + quiz, os 50 verbos irregulares mais
// comuns em inglês do dia a dia (não é a lista completa das ~200 formas
// existentes, mas cobre o que aparece com mais frequência longe).

export interface IrregularVerb {
  base: string;
  pastSimple: string;
  pastParticiple: string;
  translationPt: string;
}

export const IRREGULAR_VERBS: IrregularVerb[] = [
  { base: "be", pastSimple: "was/were", pastParticiple: "been", translationPt: "ser/estar" },
  { base: "become", pastSimple: "became", pastParticiple: "become", translationPt: "tornar-se" },
  { base: "begin", pastSimple: "began", pastParticiple: "begun", translationPt: "começar" },
  { base: "break", pastSimple: "broke", pastParticiple: "broken", translationPt: "partir/quebrar" },
  { base: "bring", pastSimple: "brought", pastParticiple: "brought", translationPt: "trazer" },
  { base: "build", pastSimple: "built", pastParticiple: "built", translationPt: "construir" },
  { base: "buy", pastSimple: "bought", pastParticiple: "bought", translationPt: "comprar" },
  { base: "catch", pastSimple: "caught", pastParticiple: "caught", translationPt: "apanhar" },
  { base: "choose", pastSimple: "chose", pastParticiple: "chosen", translationPt: "escolher" },
  { base: "come", pastSimple: "came", pastParticiple: "come", translationPt: "vir" },
  { base: "cost", pastSimple: "cost", pastParticiple: "cost", translationPt: "custar" },
  { base: "cut", pastSimple: "cut", pastParticiple: "cut", translationPt: "cortar" },
  { base: "do", pastSimple: "did", pastParticiple: "done", translationPt: "fazer" },
  { base: "drink", pastSimple: "drank", pastParticiple: "drunk", translationPt: "beber" },
  { base: "drive", pastSimple: "drove", pastParticiple: "driven", translationPt: "conduzir" },
  { base: "eat", pastSimple: "ate", pastParticiple: "eaten", translationPt: "comer" },
  { base: "fall", pastSimple: "fell", pastParticiple: "fallen", translationPt: "cair" },
  { base: "feel", pastSimple: "felt", pastParticiple: "felt", translationPt: "sentir" },
  { base: "find", pastSimple: "found", pastParticiple: "found", translationPt: "encontrar" },
  { base: "fly", pastSimple: "flew", pastParticiple: "flown", translationPt: "voar" },
  { base: "forget", pastSimple: "forgot", pastParticiple: "forgotten", translationPt: "esquecer" },
  { base: "get", pastSimple: "got", pastParticiple: "got/gotten", translationPt: "obter/ficar" },
  { base: "give", pastSimple: "gave", pastParticiple: "given", translationPt: "dar" },
  { base: "go", pastSimple: "went", pastParticiple: "gone", translationPt: "ir" },
  { base: "have", pastSimple: "had", pastParticiple: "had", translationPt: "ter" },
  { base: "hear", pastSimple: "heard", pastParticiple: "heard", translationPt: "ouvir" },
  { base: "keep", pastSimple: "kept", pastParticiple: "kept", translationPt: "manter/guardar" },
  { base: "know", pastSimple: "knew", pastParticiple: "known", translationPt: "saber/conhecer" },
  { base: "leave", pastSimple: "left", pastParticiple: "left", translationPt: "sair/deixar" },
  { base: "lose", pastSimple: "lost", pastParticiple: "lost", translationPt: "perder" },
  { base: "make", pastSimple: "made", pastParticiple: "made", translationPt: "fazer/criar" },
  { base: "meet", pastSimple: "met", pastParticiple: "met", translationPt: "encontrar (pessoa)" },
  { base: "pay", pastSimple: "paid", pastParticiple: "paid", translationPt: "pagar" },
  { base: "put", pastSimple: "put", pastParticiple: "put", translationPt: "pôr" },
  { base: "read", pastSimple: "read", pastParticiple: "read", translationPt: "ler" },
  { base: "run", pastSimple: "ran", pastParticiple: "run", translationPt: "correr" },
  { base: "say", pastSimple: "said", pastParticiple: "said", translationPt: "dizer" },
  { base: "see", pastSimple: "saw", pastParticiple: "seen", translationPt: "ver" },
  { base: "sell", pastSimple: "sold", pastParticiple: "sold", translationPt: "vender" },
  { base: "send", pastSimple: "sent", pastParticiple: "sent", translationPt: "enviar" },
  { base: "sit", pastSimple: "sat", pastParticiple: "sat", translationPt: "sentar-se" },
  { base: "sleep", pastSimple: "slept", pastParticiple: "slept", translationPt: "dormir" },
  { base: "speak", pastSimple: "spoke", pastParticiple: "spoken", translationPt: "falar" },
  { base: "spend", pastSimple: "spent", pastParticiple: "spent", translationPt: "gastar/passar (tempo)" },
  { base: "stand", pastSimple: "stood", pastParticiple: "stood", translationPt: "estar de pé/aguentar" },
  { base: "take", pastSimple: "took", pastParticiple: "taken", translationPt: "levar/tirar" },
  { base: "teach", pastSimple: "taught", pastParticiple: "taught", translationPt: "ensinar" },
  { base: "tell", pastSimple: "told", pastParticiple: "told", translationPt: "contar/dizer" },
  { base: "think", pastSimple: "thought", pastParticiple: "thought", translationPt: "pensar" },
  { base: "understand", pastSimple: "understood", pastParticiple: "understood", translationPt: "entender" },
  { base: "wake up", pastSimple: "woke up", pastParticiple: "woken up", translationPt: "acordar" },
  { base: "wear", pastSimple: "wore", pastParticiple: "worn", translationPt: "vestir/usar" },
  { base: "win", pastSimple: "won", pastParticiple: "won", translationPt: "ganhar" },
  { base: "write", pastSimple: "wrote", pastParticiple: "written", translationPt: "escrever" },
];

function dailySeed(date: Date) {
  const key = date.toISOString().slice(0, 10) + "-verb";
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return hash;
}

export function getVerbOfTheDay(date: Date = new Date()): IrregularVerb {
  const seed = dailySeed(date);
  return IRREGULAR_VERBS[seed % IRREGULAR_VERBS.length]!;
}
