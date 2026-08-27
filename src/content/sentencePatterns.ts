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
  {
    id: "false-friend-actually",
    title: "\"Actually\" não significa \"atualmente\"",
    rule: "\"Actually\" é um falso amigo clássico: significa \"na verdade\", não \"atualmente\" (esse é \"currently\" ou \"nowadays\").",
    wrong: "Actually, I live in Lisbon, but I lived in Porto before.",
    right: "Currently, I live in Lisbon, but I lived in Porto before.",
    explanation: "\"Actually\" usa-se para corrigir ou surpreender (\"Na verdade, não foi bem assim\"), não para falar do presente no tempo. Para dizer \"atualmente\", use \"currently\" ou \"nowadays\". Confundir os dois é um dos falsos amigos mais comuns entre falantes de português.",
  },
  {
    id: "false-friend-pretend",
    title: "\"Pretend\" não significa \"pretender\"",
    rule: "\"Pretend\" significa \"fingir\", não \"ter a intenção de\" — esse é \"intend\" ou \"plan to\".",
    wrong: "I pretend to travel next year.",
    right: "I intend to travel next year.",
    explanation: "\"Pretend\" em inglês é fingir algo que não é verdade (\"He pretended to be sick\"). Para dizer que tem intenção de fazer algo, use \"intend to\" ou, de forma mais natural, \"plan to\" ou \"I'm planning on\".",
  },
  {
    id: "age-with-be-old",
    title: "A idade usa \"to be\" + número + \"years old\"",
    rule: "Para dizer a idade em inglês, usa-se \"to be\" (não \"to have\"), e é preciso terminar com \"years old\" — não basta o número.",
    wrong: "I have 30 years.",
    right: "I am 30 years old.",
    explanation: "Em português diz-se \"tenho 30 anos\" (verbo ter). Em inglês, a idade usa sempre o verbo \"to be\": \"I am 30 years old\" — nunca \"I have 30 years\", que soa completamente estranho a um nativo.",
  },
  {
    id: "make-vs-do",
    title: "\"Make\" e \"do\" não são intercambiáveis",
    rule: "\"Do\" usa-se para atividades e obrigações em geral (do homework, do the dishes); \"make\" usa-se quando se cria ou produz algo (make a decision, make a mistake).",
    wrong: "I need to do a decision about the job offer.",
    right: "I need to make a decision about the job offer.",
    explanation: "Não há uma regra simples — a maioria destas combinações aprende-se caso a caso. As mais comuns com \"make\": make a decision, make a mistake, make money, make a phone call. As mais comuns com \"do\": do homework, do the shopping, do the dishes, do exercise.",
  },
  {
    id: "since-vs-for",
    title: "\"Since\" + ponto no tempo, \"for\" + duração",
    rule: "Com o Present Perfect, use \"since\" quando indica UM MOMENTO em que algo começou, e \"for\" quando indica a DURAÇÃO desse período.",
    wrong: "I have lived here for 2020.",
    right: "I have lived here since 2020.",
    explanation: "\"Since 2020\" (desde 2020, um ponto no tempo) vs. \"for five years\" (durante cinco anos, uma duração). Trocar os dois é um erro muito comum: \"since\" nunca é seguido de uma quantidade de tempo (\"since five years\" está errado), \"for\" nunca é seguido de um ano ou data específica.",
  },
  {
    id: "adverb-ending-ly",
    title: "Advérbios levam \"-ly\", não a forma do adjetivo",
    rule: "Para descrever COMO se faz uma ação (o verbo), use um advérbio (normalmente adjetivo + -ly), não o adjetivo sozinho.",
    wrong: "She sings very beautiful.",
    right: "She sings very beautifully.",
    explanation: "\"Beautiful\" é um adjetivo (descreve um substantivo: \"a beautiful song\"). Para descrever como ela canta (o verbo \"sings\"), precisa do advérbio \"beautifully\". A confusão entre adjetivo e advérbio é muito comum, porque em português o advérbio às vezes soa mais parecido com o adjetivo.",
  },
  {
    id: "i-agree-not-i-am-agree",
    title: "\"Agree\" é um verbo, não se usa com \"to be\"",
    rule: "\"Agree\" é um verbo completo em inglês (\"eu concordo\") — nunca se usa \"I am agree\", só \"I agree\".",
    wrong: "I am agree with you.",
    right: "I agree with you.",
    explanation: "Em português \"estou de acordo\" usa o verbo \"estar\" + adjetivo. Em inglês, \"agree\" já é o próprio verbo (\"concordar\"), por isso não precisa nem aceita o \"to be\" antes: apenas \"I agree\", \"she agrees\", \"we agreed\".",
  },
  {
    id: "gerund-after-preposition",
    title: "Depois de uma preposição, usa-se sempre -ing",
    rule: "Depois de qualquer preposição (before, after, without, instead of...), o verbo seguinte tem sempre a forma -ing (gerúndio), nunca o infinitivo com \"to\".",
    wrong: "Before to go to bed, I always read a little.",
    right: "Before going to bed, I always read a little.",
    explanation: "\"Before\", \"after\", \"without\", \"instead of\" são preposições em inglês, e depois de qualquer preposição o verbo fica em -ing: \"before going\", \"after eating\", \"without asking\". Usar \"to\" + infinitivo depois de uma preposição está sempre errado.",
  },
  {
    id: "no-double-negative",
    title: "Inglês não usa dupla negação",
    rule: "Ao contrário do português, o inglês standard usa apenas UMA palavra negativa por frase — nunca duas.",
    wrong: "I don't have nothing to say.",
    right: "I don't have anything to say.",
    explanation: "Em português, \"não tenho nada\" tem duas negações (\"não\" + \"nada\") e está correto. Em inglês standard, isso soa como duas negações que se cancelam ou simplesmente incorreto — use \"anything\" (não \"nothing\") depois de uma negação já existente: \"I don't have anything\", não \"I don't have nothing\".",
  },
];
