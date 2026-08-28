// Ordenar Frases — tipo de exercício novo (pedido do utilizador, 2026-08-28:
// "tipos de exercícios diferentes"). Nenhum exercício existente testa ordem
// das palavras de forma ativa: escolha múltipla testa reconhecimento,
// tradução/ditado testam produção livre, mas nenhum força o utilizador a
// construir a sequência sintática correta com as próprias mãos — o erro mais
// comum e mais difícil de "ouvir" para falantes de português, cuja ordem de
// advérbios, negação e perguntas segue regras bem diferentes do inglês.
//
// Conteúdo estático (mesmo padrão de dictation.ts/irregularVerbs.ts, sem
// schema/seed novo). `words` já vem na ordem CORRETA — o componente baralha
// no cliente; o servidor nunca recebe nem confia numa ordem "correta" vinda
// do cliente, só compara a sequência submetida contra este array, pelo id.

export interface OrderingItem {
  id: string;
  level: string;
  words: string[];
  translationPt: string;
  focus: string;
}

export const ORDERING_ITEMS: OrderingItem[] = [
  {
    id: "o-01",
    level: "Pre-A1",
    words: ["My", "name", "is", "Ana."],
    translationPt: "O meu nome é Ana.",
    focus: "Ordem básica sujeito-verbo-complemento.",
  },
  {
    id: "o-02",
    level: "Pre-A1",
    words: ["I", "am", "thirty", "years", "old."],
    translationPt: "Eu tenho trinta anos.",
    focus: "\"I am ... years old\" — em português usa-se \"ter\", não \"ser/estar\".",
  },
  {
    id: "o-03",
    level: "A1",
    words: ["She", "goes", "to", "work", "every", "day."],
    translationPt: "Ela vai trabalhar todos os dias.",
    focus: "\"Every day\" no fim da frase, não junto ao verbo como em português.",
  },
  {
    id: "o-04",
    level: "A1",
    words: ["I", "don't", "like", "coffee."],
    translationPt: "Eu não gosto de café.",
    focus: "Negação com \"don't\" antes do verbo principal, não depois.",
  },
  {
    id: "o-05",
    level: "A1",
    words: ["Where", "is", "the", "train", "station?"],
    translationPt: "Onde é a estação de comboios?",
    focus: "Pergunta: palavra interrogativa + verbo \"be\" antes do sujeito.",
  },
  {
    id: "o-06",
    level: "A1",
    words: ["He", "always", "arrives", "late."],
    translationPt: "Ele chega sempre atrasado.",
    focus: "Advérbio de frequência ANTES do verbo principal — em português vai no fim.",
  },
  {
    id: "o-07",
    level: "A1",
    words: ["Can", "you", "help", "me,", "please?"],
    translationPt: "Pode ajudar-me, por favor?",
    focus: "Pergunta com modal \"can\" antes do sujeito.",
  },
  {
    id: "o-08",
    level: "A2",
    words: ["I", "have", "never", "been", "to", "London."],
    translationPt: "Eu nunca fui a Londres.",
    focus: "\"Never\" entre o auxiliar \"have\" e o particípio, nunca no início.",
  },
  {
    id: "o-09",
    level: "A2",
    words: ["She", "is", "not", "going", "to", "the", "party."],
    translationPt: "Ela não vai à festa.",
    focus: "Negação com \"be going to\" — \"not\" logo a seguir a \"is\".",
  },
  {
    id: "o-10",
    level: "A2",
    words: ["What", "time", "does", "the", "shop", "open?"],
    translationPt: "A que horas abre a loja?",
    focus: "Pergunta com \"does\" — o verbo principal fica na forma base.",
  },
  {
    id: "o-11",
    level: "A2",
    words: ["I", "usually", "have", "breakfast", "at", "eight."],
    translationPt: "Eu costumo tomar o pequeno-almoço às oito.",
    focus: "\"Usually\" antes do verbo principal (não é \"be\"), não no fim.",
  },
  {
    id: "o-12",
    level: "A2",
    words: ["They", "were", "watching", "TV", "when", "I", "arrived."],
    translationPt: "Eles estavam a ver TV quando eu cheguei.",
    focus: "Past Continuous (ação em curso) + Past Simple (interrupção) na mesma frase.",
  },
  {
    id: "o-13",
    level: "A2",
    words: ["He", "is", "the", "tallest", "boy", "in", "the", "class."],
    translationPt: "Ele é o rapaz mais alto da turma.",
    focus: "Superlativo antes do substantivo, ao contrário do português.",
  },
  {
    id: "o-14",
    level: "B1",
    words: ["If", "I", "had", "more", "time,", "I", "would", "travel", "more."],
    translationPt: "Se eu tivesse mais tempo, viajava mais.",
    focus: "Second Conditional: \"If\" + passado, depois \"would\" + infinitivo.",
  },
  {
    id: "o-15",
    level: "B1",
    words: ["The", "book", "that", "I", "bought", "is", "really", "good."],
    translationPt: "O livro que comprei é muito bom.",
    focus: "Oração relativa \"that I bought\" logo a seguir ao substantivo.",
  },
  {
    id: "o-16",
    level: "B1",
    words: ["She", "asked", "me", "where", "I", "lived."],
    translationPt: "Ela perguntou-me onde é que eu vivia.",
    focus: "Discurso indireto: sem inversão, ordem afirmativa depois de \"where\".",
  },
  {
    id: "o-17",
    level: "B1",
    words: ["By", "next", "year,", "I", "will", "have", "finished", "my", "degree."],
    translationPt: "No próximo ano, já terei terminado o curso.",
    focus: "Future Perfect: ação concluída antes de um momento futuro.",
  },
  {
    id: "o-18",
    level: "B1",
    words: ["I", "wish", "I", "had", "studied", "harder."],
    translationPt: "Quem me dera ter estudado mais.",
    focus: "\"Wish\" + past perfect para arrependimento sobre o passado.",
  },
  {
    id: "o-19",
    level: "B1",
    words: ["She", "not", "only", "passed", "the", "exam", "but", "also", "got", "the", "highest", "score."],
    translationPt: "Ela não só passou no exame como também teve a nota mais alta.",
    focus: "\"Not only... but also\" liga duas ações na mesma ordem lógica.",
  },
  {
    id: "o-20",
    level: "B1",
    words: ["The", "meeting", "has", "been", "postponed", "until", "next", "week."],
    translationPt: "A reunião foi adiada para a próxima semana.",
    focus: "Voz passiva: \"has been postponed\", sem sujeito ativo.",
  },
];

export function getOrderingItem(id: string): OrderingItem | undefined {
  return ORDERING_ITEMS.find((o) => o.id === id);
}
