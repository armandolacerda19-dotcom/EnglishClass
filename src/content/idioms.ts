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
  {
    id: "once-in-a-blue-moon",
    phrase: "once in a blue moon",
    literalPt: "uma vez numa lua azul",
    meaningEn: "very rarely",
    meaningPt: "muito raramente",
    example: "We only see each other once in a blue moon these days.",
    distractors: ["every single day", "once a month exactly", "on special holidays only"],
  },
  {
    id: "cost-an-arm-and-a-leg",
    phrase: "cost an arm and a leg",
    literalPt: "custar um braço e uma perna",
    meaningEn: "to be very expensive",
    meaningPt: "ser muito caro",
    example: "That new laptop cost an arm and a leg.",
    distractors: ["to be dangerous", "to take a long time", "to be free of charge"],
  },
  {
    id: "hit-the-nail-on-the-head",
    phrase: "hit the nail on the head",
    literalPt: "acertar no prego na cabeça",
    meaningEn: "to describe exactly what is causing a problem or situation",
    meaningPt: "descrever exatamente o que está a causar um problema ou situação",
    example: "You hit the nail on the head — that's exactly why the project failed.",
    distractors: ["to make a small mistake", "to hurt yourself accidentally", "to change the subject"],
  },
  {
    id: "let-the-cat-out-of-the-bag",
    phrase: "let the cat out of the bag",
    literalPt: "deixar sair o gato do saco",
    meaningEn: "to accidentally reveal a secret",
    meaningPt: "revelar um segredo acidentalmente",
    example: "I let the cat out of the bag and told her about the surprise party.",
    distractors: ["to lose something important", "to buy a pet", "to break a promise on purpose"],
  },
  {
    id: "the-ball-is-in-your-court",
    phrase: "the ball is in your court",
    literalPt: "a bola está no teu campo",
    meaningEn: "it's your turn to make a decision or take action",
    meaningPt: "é a tua vez de decidir ou agir",
    example: "I've done everything I can — the ball is in your court now.",
    distractors: ["you are in a lot of trouble", "the game has just started", "you have won a competition"],
  },
  {
    id: "on-the-same-page",
    phrase: "on the same page",
    literalPt: "na mesma página",
    meaningEn: "having the same understanding or opinion as someone else",
    meaningPt: "ter o mesmo entendimento ou opinião que outra pessoa",
    example: "Before we start, let's make sure we're all on the same page.",
    distractors: ["reading the same book", "sitting next to each other", "working on the same document"],
  },
  {
    id: "call-it-a-day",
    phrase: "call it a day",
    literalPt: "chamar-lhe um dia",
    meaningEn: "to stop working on something for the day",
    meaningPt: "parar de trabalhar em algo por hoje",
    example: "We've done a lot today — let's call it a day.",
    distractors: ["to plan the next day", "to celebrate a birthday", "to start a new project"],
  },
  {
    id: "make-ends-meet",
    phrase: "make ends meet",
    literalPt: "fazer as pontas encontrarem-se",
    meaningEn: "to have just enough money to live on",
    meaningPt: "ter apenas dinheiro suficiente para viver",
    example: "With prices this high, it's hard to make ends meet.",
    distractors: ["to become very rich", "to lend money to a friend", "to plan a big trip"],
  },
  {
    id: "sit-on-the-fence",
    phrase: "sit on the fence",
    literalPt: "sentar-se na vedação",
    meaningEn: "to avoid making a decision or taking a side",
    meaningPt: "evitar tomar uma decisão ou escolher um lado",
    example: "Stop sitting on the fence and tell us what you really think.",
    distractors: ["to relax outdoors", "to wait patiently", "to change your mind often"],
  },
  {
    id: "hang-in-there",
    phrase: "hang in there",
    literalPt: "pendurar-se ali",
    meaningEn: "to keep trying despite a difficult situation",
    meaningPt: "continuar a tentar apesar de uma situação difícil",
    example: "I know it's tough right now, but hang in there — it will get better.",
    distractors: ["to give up quickly", "to wait outside a building", "to hold something heavy"],
  },
  {
    id: "figure-out",
    phrase: "figure out",
    literalPt: "descobrir o cálculo",
    meaningEn: "to understand or solve something after thinking about it",
    meaningPt: "compreender ou resolver algo depois de pensar sobre isso",
    example: "It took me a while to figure out how the new software works.",
    distractors: ["to ignore a problem completely", "to write something down", "to ask someone else to do it"],
  },
  {
    id: "come-up-with",
    phrase: "come up with",
    literalPt: "vir para cima com",
    meaningEn: "to think of an idea or plan",
    meaningPt: "pensar numa ideia ou plano",
    example: "She came up with a great solution to the problem.",
    distractors: ["to arrive somewhere with someone", "to disagree with an idea", "to copy someone else's work"],
  },
  {
    id: "put-off",
    phrase: "put off",
    literalPt: "pôr fora",
    meaningEn: "to postpone or delay doing something",
    meaningPt: "adiar ou atrasar fazer algo",
    example: "I keep putting off my dentist appointment.",
    distractors: ["to cancel something completely", "to finish something early", "to switch off a light"],
  },
  {
    id: "look-after",
    phrase: "look after",
    literalPt: "olhar depois",
    meaningEn: "to take care of someone or something",
    meaningPt: "cuidar de alguém ou de algo",
    example: "Can you look after my cat while I'm away?",
    distractors: ["to search for something lost", "to ignore someone", "to follow someone secretly"],
  },
  {
    id: "turn-down",
    phrase: "turn down",
    literalPt: "virar para baixo",
    meaningEn: "to refuse an offer, invitation or request",
    meaningPt: "recusar uma oferta, convite ou pedido",
    example: "She turned down the job offer because the salary was too low.",
    distractors: ["to accept immediately", "to reduce the volume of music", "to arrive late"],
  },
  {
    id: "get-over",
    phrase: "get over",
    literalPt: "passar por cima",
    meaningEn: "to recover from an illness, disappointment or difficult experience",
    meaningPt: "recuperar de uma doença, desilusão ou experiência difícil",
    example: "It took him months to get over the breakup.",
    distractors: ["to climb over something physically", "to become ill again", "to forget someone's name"],
  },
  {
    id: "go-through",
    phrase: "go through",
    literalPt: "passar através",
    meaningEn: "to experience something difficult, or to examine something carefully",
    meaningPt: "passar por algo difícil, ou examinar algo cuidadosamente",
    example: "She's going through a hard time at work right now.",
    distractors: ["to travel to a new country", "to skip a step quickly", "to celebrate an achievement"],
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
