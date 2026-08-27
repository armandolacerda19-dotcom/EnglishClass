// Construção frásica — pedido explícito do utilizador (2026-08-26). Erros de
// ordem de palavras persistem muito depois de a gramática "estar aprendida",
// porque raramente são ensinados como um tópico próprio — ficam escondidos
// dentro de exercícios de outras coisas. Aqui são o assunto principal.

export interface SentencePattern {
  id: string;
  title: string;
  rule: string;
  wrong: string;
  right: string;
  explanation: string;
}

export const SENTENCE_PATTERNS: SentencePattern[] = [
  {
    id: "adjective-before-noun",
    title: "Adjetivo antes do substantivo",
    rule: "Quando o adjetivo qualifica diretamente um substantivo, vem ANTES dele em inglês — ao contrário do português.",
    wrong: "I bought a car red.",
    right: "I bought a red car.",
    explanation: "Em português dizemos \"um carro vermelho\" (substantivo + adjetivo). Em inglês é ao contrário: \"a red car\" (adjetivo + substantivo). Há exceções que vai ouvir — depois de \"something/anything\" (\"something interesting\") e em algumas expressões fixas (\"attorney general\") — mas na esmagadora maioria dos casos a ordem é adjetivo + substantivo.",
  },
  {
    id: "question-do-does",
    title: "Perguntas precisam de \"do/does/did\"",
    rule: "Para fazer uma pergunta com um verbo normal (não \"to be\"), é preciso adicionar \"do/does/did\" antes do sujeito — não basta inverter a ordem como em português.",
    wrong: "You like coffee?",
    right: "Do you like coffee?",
    explanation: "Em português, \"Gostas de café?\" só muda a entoação. Em inglês, é obrigatório o auxiliar \"do\" (ou \"does\" na 3ª pessoa, \"did\" no passado) no início — sem ele, a frase soa estranha ou incompleta para um nativo.",
  },
  {
    id: "negation-dont-doesnt",
    title: "Negação com \"don't/doesn't\"",
    rule: "Para negar um verbo normal, use \"don't/doesn't/didn't\" + verbo na forma base — nunca \"no\" sozinho antes do verbo.",
    wrong: "I no like this.",
    right: "I don't like this.",
    explanation: "Tradução direta de \"não gosto\" tenta-se com \"I no like\", mas isso não existe em inglês. O verbo auxiliar \"don't\" (ou \"doesn't\"/\"didn't\") é sempre necessário para negar verbos que não sejam \"to be\" ou auxiliares.",
  },
  {
    id: "adverb-position",
    title: "Advérbios de frequência antes do verbo principal",
    rule: "Advérbios como \"always\", \"usually\", \"never\", \"often\" vêm ANTES do verbo principal, mas DEPOIS do verbo \"to be\".",
    wrong: "I go always to the gym on Mondays.",
    right: "I always go to the gym on Mondays.",
    explanation: "\"Always\" fica entre o sujeito e o verbo principal (\"I always go\"), não depois do verbo como seria natural traduzir diretamente do português (\"vou sempre\"). Exceção: com \"to be\", o advérbio vem depois — \"She is always late.\"",
  },
  {
    id: "there-is-are",
    title: "\"There is/There are\", não \"has/have\"",
    rule: "Para dizer que algo existe num sítio, use \"there is\" (singular) ou \"there are\" (plural) — não \"it has\" ou \"has\" sozinho.",
    wrong: "Has a supermarket near my house.",
    right: "There is a supermarket near my house.",
    explanation: "Em português \"há um supermercado\" não tem sujeito explícito. Em inglês, a frase precisa de \"there\" como sujeito gramatical: \"there is\" (um) / \"there are\" (vários) — nunca comece a frase só com \"has\".",
  },
  {
    id: "possessive-s",
    title: "Posse com 's, não \"of\" para pessoas",
    rule: "Para dizer que algo pertence a uma pessoa, use nome/pronome + 's + objeto — não \"the [objeto] of [pessoa]\".",
    wrong: "The car of my brother is new.",
    right: "My brother's car is new.",
    explanation: "Com pessoas, o inglês prefere \"'s\" (genitivo saxónico): \"my brother's car\", não \"the car of my brother\" (que soa muito formal/estranho, embora gramaticalmente possível). \"Of\" é mais comum com objetos: \"the door of the house\".",
  },
  {
    id: "prepositions-time",
    title: "Preposições de tempo: in / on / at",
    rule: "\"In\" para meses/anos/estações, \"on\" para dias/datas, \"at\" para horas exatas — cada uma tem o seu uso específico, não são intercambiáveis.",
    wrong: "I will see you in Monday at 3pm... in the 25th December.",
    right: "I will see you on Monday at 3pm... on the 25th of December.",
    explanation: "In: meses, anos, estações (\"in July\", \"in 2024\", \"in summer\"). On: dias e datas (\"on Monday\", \"on 25th December\"). At: horas e alguns lugares fixos (\"at 3pm\", \"at home\"). Confundir estas três é um dos erros mais comuns e persistentes de falantes de português.",
  },
  {
    id: "subject-verb-object",
    title: "Ordem fixa: Sujeito + Verbo + Objeto",
    rule: "O inglês tem uma ordem de palavras muito mais rígida do que o português — normalmente não se pode reorganizar a frase livremente para dar ênfase.",
    wrong: "Coffee I like a lot.",
    right: "I like coffee a lot.",
    explanation: "Em português, \"Café, eu gosto muito\" é uma reorganização natural para dar ênfase. Em inglês, essa liberdade quase não existe — a ordem Sujeito-Verbo-Objeto é praticamente obrigatória. Para dar ênfase, o inglês usa outras ferramentas (entoação, \"actually\", \"really\"), não reordenar a frase.",
  },
];
