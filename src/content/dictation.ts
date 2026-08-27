// Ditado (dictation) — Fase 4, auditoria secções 291/310 ("dictation" listado
// como conteúdo em falta). Reaproveita a síntese de voz já usada em
// PlayTranscript (Web Speech API, sem custo) para ler uma frase em voz alta
// sem mostrar o texto; o utilizador escreve o que ouviu e compara-se com o
// original. Conteúdo estático (mesmo padrão de readingPassages.ts/idioms.ts),
// sem schema/seed novo. Frases escolhidas por pontos que costumam confundir
// falantes de português na escrita (homófonos, plurais irregulares,
// contrações, "-ed"/"-s" silenciosos que se ouvem mas escrevem-se sempre).

export interface DictationItem {
  id: string;
  level: string;
  text: string;
  translationPt: string;
  focus: string;
}

export const DICTATION_ITEMS: DictationItem[] = [
  {
    id: "d-01",
    level: "Pre-A1",
    text: "My name is Ana.",
    translationPt: "O meu nome é Ana.",
    focus: "Frase muito curta — introdução ao formato do exercício.",
  },
  {
    id: "d-02",
    level: "Pre-A1",
    text: "I am thirty years old.",
    translationPt: "Eu tenho trinta anos.",
    focus: "\"I am ... years old\", não \"I have\".",
  },
  {
    id: "d-03",
    level: "A1",
    text: "She lives in a small flat.",
    translationPt: "Ela vive num apartamento pequeno.",
    focus: "-s da 3ª pessoa em \"lives\", fácil de não ouvir.",
  },
  {
    id: "d-04",
    level: "A1",
    text: "There are two apples on the table.",
    translationPt: "Há duas maçãs em cima da mesa.",
    focus: "\"There are\" + plural, e o plural irregular está ausente aqui de propósito (regular primeiro).",
  },
  {
    id: "d-05",
    level: "A1",
    text: "He doesn't like coffee.",
    translationPt: "Ele não gosta de café.",
    focus: "Contração \"doesn't\", muitas vezes escrita sem apóstrofo.",
  },
  {
    id: "d-06",
    level: "A1",
    text: "We went to the beach yesterday.",
    translationPt: "Fomos à praia ontem.",
    focus: "\"went\", passado irregular de \"go\" — soa diferente do infinitivo.",
  },
  {
    id: "d-07",
    level: "A1",
    text: "They're going to visit their grandparents.",
    translationPt: "Eles vão visitar os avós.",
    focus: "Homófonos \"they're\" / \"their\" — mesmo som, escrita diferente.",
  },
  {
    id: "d-08",
    level: "A1",
    text: "It's a beautiful day, isn't it?",
    translationPt: "Está um dia bonito, não está?",
    focus: "Question tag \"isn't it\" — ritmo rápido, fácil de perder a última palavra.",
  },
  {
    id: "d-09",
    level: "A2",
    text: "I have already finished my homework.",
    translationPt: "Eu já terminei os meus trabalhos de casa.",
    focus: "Present Perfect com \"already\" — \"have\" átono, quase inaudível.",
  },
  {
    id: "d-10",
    level: "A2",
    text: "You should drink more water every day.",
    translationPt: "Devias beber mais água todos os dias.",
    focus: "\"should\" — vogal curta, confunde-se com \"could\"/\"would\" ao ouvido.",
  },
  {
    id: "d-11",
    level: "A2",
    text: "Whose bag is this? It's mine.",
    translationPt: "De quem é esta mala? É minha.",
    focus: "Homófonos \"whose\" / \"who's\".",
  },
  {
    id: "d-12",
    level: "A2",
    text: "There's too much sugar in this cake.",
    translationPt: "Há açúcar a mais neste bolo.",
    focus: "\"too much\" com incontável — contraste com \"too many\".",
  },
  {
    id: "d-13",
    level: "A2",
    text: "If it rains tomorrow, we won't go to the park.",
    translationPt: "Se chover amanhã, não vamos ao parque.",
    focus: "First Conditional — \"won't\" contraído, fácil de ouvir como \"want\".",
  },
  {
    id: "d-14",
    level: "A2",
    text: "The weather was worse than I expected.",
    translationPt: "O tempo esteve pior do que eu esperava.",
    focus: "Comparativo irregular \"worse\", não \"more bad\".",
  },
  {
    id: "d-15",
    level: "B1",
    text: "By the time we arrived, the meeting had already started.",
    translationPt: "Quando chegámos, a reunião já tinha começado.",
    focus: "Past Perfect — \"had already started\", três palavras curtas seguidas.",
  },
  {
    id: "d-16",
    level: "B1",
    text: "This report was written by the finance team.",
    translationPt: "Este relatório foi escrito pela equipa financeira.",
    focus: "Voz passiva — \"was written by\", fácil de escrever \"wrote\".",
  },
  {
    id: "d-17",
    level: "B1",
    text: "She said she would call me back later.",
    translationPt: "Ela disse que me ligaria mais tarde.",
    focus: "Discurso indireto — \"would\" em vez de \"will\".",
  },
  {
    id: "d-18",
    level: "B1",
    text: "I'm not used to waking up this early.",
    translationPt: "Não estou habituado a acordar tão cedo.",
    focus: "\"used to\" + gerúndio — padrão que se confunde com \"I used to wake up\".",
  },
  {
    id: "d-19",
    level: "B1",
    text: "The company whose logo you saw is based in Lisbon.",
    translationPt: "A empresa cujo logótipo viste está sediada em Lisboa.",
    focus: "Clausula relativa com \"whose\" referindo-se a uma coisa.",
  },
  {
    id: "d-20",
    level: "B1",
    text: "This time next year, I'll be living abroad.",
    translationPt: "Nesta altura no próximo ano, eu vou estar a viver no estrangeiro.",
    focus: "Future Continuous — \"I'll be living\", três formas verbais seguidas.",
  },
];

export function getDictationItem(id: string): DictationItem | undefined {
  return DICTATION_ITEMS.find((d) => d.id === id);
}
