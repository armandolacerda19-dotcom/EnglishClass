// Verbos irregulares — item "verbos" pedido explicitamente pelo utilizador
// (2026-08-26): "deve investir em conteúdo de gramática, verbos, construção
// frásica, vocabulário". Referência + quiz, ~87 verbos irregulares comuns em
// inglês do dia a dia (não é a lista completa das ~200 formas existentes, mas
// cobre o que aparece com mais frequência). Nota 2026-08-26 (auditoria):
// "wake up" foi corrigido para "wake" — a forma base do verbo irregular é
// "wake" (woke/woken); "up" é a partícula do phrasal verb, não faz parte da
// conjugação irregular em si.

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
  { base: "wake", pastSimple: "woke", pastParticiple: "woken", translationPt: "acordar" },
  { base: "wear", pastSimple: "wore", pastParticiple: "worn", translationPt: "vestir/usar" },
  { base: "win", pastSimple: "won", pastParticiple: "won", translationPt: "ganhar" },
  { base: "write", pastSimple: "wrote", pastParticiple: "written", translationPt: "escrever" },
  { base: "bear", pastSimple: "bore", pastParticiple: "borne", translationPt: "suportar/aguentar" },
  { base: "beat", pastSimple: "beat", pastParticiple: "beaten", translationPt: "vencer/bater" },
  { base: "bend", pastSimple: "bent", pastParticiple: "bent", translationPt: "dobrar/curvar" },
  { base: "bite", pastSimple: "bit", pastParticiple: "bitten", translationPt: "morder" },
  { base: "blow", pastSimple: "blew", pastParticiple: "blown", translationPt: "soprar" },
  { base: "dig", pastSimple: "dug", pastParticiple: "dug", translationPt: "cavar" },
  { base: "draw", pastSimple: "drew", pastParticiple: "drawn", translationPt: "desenhar" },
  { base: "fight", pastSimple: "fought", pastParticiple: "fought", translationPt: "lutar" },
  { base: "forgive", pastSimple: "forgave", pastParticiple: "forgiven", translationPt: "perdoar" },
  { base: "freeze", pastSimple: "froze", pastParticiple: "frozen", translationPt: "congelar" },
  { base: "grow", pastSimple: "grew", pastParticiple: "grown", translationPt: "crescer/cultivar" },
  { base: "hang", pastSimple: "hung", pastParticiple: "hung", translationPt: "pendurar" },
  { base: "hide", pastSimple: "hid", pastParticiple: "hidden", translationPt: "esconder" },
  { base: "hit", pastSimple: "hit", pastParticiple: "hit", translationPt: "bater/acertar" },
  { base: "hold", pastSimple: "held", pastParticiple: "held", translationPt: "segurar" },
  { base: "hurt", pastSimple: "hurt", pastParticiple: "hurt", translationPt: "magoar" },
  { base: "lay", pastSimple: "laid", pastParticiple: "laid", translationPt: "colocar/pousar" },
  { base: "lead", pastSimple: "led", pastParticiple: "led", translationPt: "liderar" },
  { base: "lend", pastSimple: "lent", pastParticiple: "lent", translationPt: "emprestar" },
  { base: "let", pastSimple: "let", pastParticiple: "let", translationPt: "deixar/permitir" },
  { base: "lie", pastSimple: "lay", pastParticiple: "lain", translationPt: "deitar-se" },
  { base: "light", pastSimple: "lit", pastParticiple: "lit", translationPt: "acender" },
  { base: "mean", pastSimple: "meant", pastParticiple: "meant", translationPt: "significar" },
  { base: "ride", pastSimple: "rode", pastParticiple: "ridden", translationPt: "andar (bicicleta/cavalo)" },
  { base: "ring", pastSimple: "rang", pastParticiple: "rung", translationPt: "tocar (campainha/telefone)" },
  { base: "rise", pastSimple: "rose", pastParticiple: "risen", translationPt: "subir/levantar-se" },
  { base: "set", pastSimple: "set", pastParticiple: "set", translationPt: "definir/colocar" },
  { base: "shake", pastSimple: "shook", pastParticiple: "shaken", translationPt: "abanar/tremer" },
  { base: "shine", pastSimple: "shone", pastParticiple: "shone", translationPt: "brilhar" },
  { base: "shoot", pastSimple: "shot", pastParticiple: "shot", translationPt: "disparar" },
  { base: "show", pastSimple: "showed", pastParticiple: "shown", translationPt: "mostrar" },
  { base: "shut", pastSimple: "shut", pastParticiple: "shut", translationPt: "fechar" },
  { base: "sing", pastSimple: "sang", pastParticiple: "sung", translationPt: "cantar" },
  { base: "sink", pastSimple: "sank", pastParticiple: "sunk", translationPt: "afundar" },
  { base: "spread", pastSimple: "spread", pastParticiple: "spread", translationPt: "espalhar" },
  { base: "steal", pastSimple: "stole", pastParticiple: "stolen", translationPt: "roubar" },
  { base: "stick", pastSimple: "stuck", pastParticiple: "stuck", translationPt: "colar/ficar preso" },
  { base: "strike", pastSimple: "struck", pastParticiple: "struck", translationPt: "atingir/fazer greve" },
  { base: "swear", pastSimple: "swore", pastParticiple: "sworn", translationPt: "jurar" },
  { base: "sweep", pastSimple: "swept", pastParticiple: "swept", translationPt: "varrer" },
  { base: "swim", pastSimple: "swam", pastParticiple: "swum", translationPt: "nadar" },
  { base: "swing", pastSimple: "swung", pastParticiple: "swung", translationPt: "balançar" },
  { base: "throw", pastSimple: "threw", pastParticiple: "thrown", translationPt: "atirar" },
  { base: "withdraw", pastSimple: "withdrew", pastParticiple: "withdrawn", translationPt: "retirar/levantar (dinheiro)" },
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
