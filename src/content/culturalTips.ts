// Cultura e pragmática — item #9 da lista de melhorias. Regras de gramática não
// chegam para soar natural: registo, small talk e diferenças AmE/BrE são o que
// separa "correto" de "parece um nativo". Conteúdo estático, mesmo padrão de
// src/content/readingPassages.ts.

export interface CulturalTip {
  id: string;
  title: string;
  category: "small_talk" | "register" | "variants" | "etiquette";
  body: string;
  example?: { situation: string; text: string };
}

export const CULTURAL_TIPS: CulturalTip[] = [
  {
    id: "small-talk-weather",
    title: "Small Talk: o tempo é sempre seguro",
    category: "small_talk",
    body:
      "Em inglês (sobretudo britânico), comentar o tempo é a forma mais comum de puxar conversa com um estranho — no elevador, na fila, à espera de uma reunião começar. Não é falta de imaginação, é um ritual social que sinaliza \"estou disponível para uma conversa breve e simpática\", sem se comprometer a nada mais profundo.",
    example: { situation: "À espera do elevador", text: "\"Horrible weather today, isn't it?\" — \"I know, it hasn't stopped raining all week.\"" },
  },
  {
    id: "register-can-i-vs-could-i",
    title: "\"Can I\" vs. \"Could I\": não é só gramática",
    category: "register",
    body:
      "\"Could I...\" não é apenas \"can\" no passado — é mais formal e mais educado, mesmo a falar do presente. Use \"could\" com desconhecidos, superiores hierárquicos ou em contextos profissionais; \"can\" é normal entre amigos ou em situações casuais. Isto é uma questão de registo, não de tempo verbal.",
    example: { situation: "A pedir a um colega vs. a um cliente", text: "Colega: \"Can you send me that file?\" · Cliente: \"Could you please send me that file when you have a moment?\"" },
  },
  {
    id: "variants-am-vs-br",
    title: "Inglês americano vs. britânico: nem sempre é só sotaque",
    category: "variants",
    body:
      "Vocabulário do dia a dia muda bastante: apartment (AmE) vs. flat (BrE), elevator vs. lift, vacation vs. holiday, trash vs. rubbish. Nenhum está \"errado\" — escolha uma variante e seja consistente, em vez de misturar as duas na mesma frase.",
    example: { situation: "A falar de onde vive", text: "AmE: \"I live in a small apartment downtown.\" · BrE: \"I live in a small flat in the city centre.\"" },
  },
  {
    id: "etiquette-declining-politely",
    title: "Recusar sem ser direto de mais",
    category: "etiquette",
    body:
      "Um \"no\" direto pode soar brusco em inglês, mesmo quando é claramente uma recusa. É comum suavizar com uma desculpa ou alternativa: \"I'd love to, but...\", \"I'm afraid I can't...\", \"That doesn't quite work for me, but how about...\". Isto não é hipocrisia — é a forma esperada de manter a relação intacta.",
    example: { situation: "A recusar um convite", text: "\"I'd love to, but I already have plans that day — maybe next time?\"" },
  },
  {
    id: "small-talk-how-are-you",
    title: "\"How are you?\" não é uma pergunta a sério",
    category: "small_talk",
    body:
      "Na maior parte das interações rápidas (a cumprimentar um colega, a entrar numa loja), \"How are you?\" funciona como um cumprimento, não como um convite para descrever o seu dia em detalhe. A resposta esperada é curta e positiva — \"Good, thanks, you?\" — a não ser que a pessoa pergunte a sério e pare para ouvir.",
    example: { situation: "A cruzar-se com um colega no corredor", text: "\"Hey, how are you?\" — \"Good, thanks! You?\" — \"Can't complain!\"" },
  },
];
