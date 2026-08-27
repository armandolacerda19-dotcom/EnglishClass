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
  {
    id: "etiquette-apologizing",
    title: "\"Sorry\" usa-se muito mais do que em português",
    category: "etiquette",
    body:
      "Em inglês, sobretudo britânico, \"sorry\" usa-se para muito mais do que pedir desculpa a sério — diz-se quando se esbarra ligeiramente em alguém, quando se pede para repetir algo (\"Sorry?\"), ou até quando se interrompe alguém educadamente. Não usar \"sorry\" nestas situações pode soar rude, mesmo sem intenção nenhuma.",
    example: { situation: "A pedir para repetir algo que não ouviu bem", text: "\"Sorry, could you say that again?\"" },
  },
  {
    id: "etiquette-disagreeing-politely",
    title: "Discordar sem confrontar diretamente",
    category: "etiquette",
    body:
      "Discordar frontalmente (\"You're wrong\") soa mais agressivo em inglês do que em português informal. É comum suavizar com frases como \"I see your point, but...\", \"I'm not sure I agree...\", ou \"That's an interesting way to look at it, although...\" antes de apresentar a opinião contrária.",
    example: { situation: "Numa reunião de trabalho", text: "\"I see your point, but I think we should consider the cost first.\"" },
  },
  {
    id: "register-email-openings",
    title: "Como começar um email de trabalho",
    category: "register",
    body:
      "\"Dear\" é a forma mais formal para começar um email (com o nome ou \"Sir/Madam\" se não souber o nome). \"Hi\" ou \"Hello\" seguido do primeiro nome é normal entre colegas ou em contextos menos formais. Começar sem nenhuma saudação pode soar brusco em inglês, mesmo num email rápido.",
    example: { situation: "Email a um cliente novo", text: "\"Dear Mr. Silva, Thank you for reaching out...\"" },
  },
  {
    id: "register-please-and-thanks",
    title: "\"Please\" e \"thank you\" aparecem mais vezes do que esperaria",
    category: "register",
    body:
      "Falantes de inglês tendem a repetir \"please\" e \"thank you\" com mais frequência do que a tradução literal do português sugeriria — mesmo em pedidos simples ou já esperados. Omitir estas palavras num pedido direto (\"Give me the menu\") pode soar mais brusco em inglês do que soaria em português.",
    example: { situation: "A pedir a ementa num restaurante", text: "\"Could I have the menu, please?\" — \"Of course! Here you go.\" — \"Thank you so much.\"" },
  },
  {
    id: "variants-numbers-and-dates",
    title: "Datas: ordem diferente entre AmE e BrE",
    category: "variants",
    body:
      "Em inglês britânico, as datas escrevem-se dia/mês/ano (25/12/2026), como em português. Em inglês americano, é mês/dia/ano (12/25/2026) — a mesma data escrita de forma diferente pode gerar confusões graves (03/04 é 3 de abril ou 4 de março?). Quando há dúvida, escreva o mês por extenso.",
    example: { situation: "A confirmar uma reunião por escrito", text: "\"Let's meet on 3 April 2026\" evita qualquer ambiguidade, ao contrário de \"03/04/2026\"." },
  },
  {
    id: "etiquette-phone-calls",
    title: "Ao telefone: apresentar-se logo no início",
    category: "etiquette",
    body:
      "Ao telefone em inglês, é normal identificar-se logo na primeira frase, mesmo que a pessoa já tenha o seu número guardado: \"Hi, this is Ana calling about...\". Começar sem se identificar, ou perguntar diretamente \"quem fala\", pode soar mais brusco do que em português.",
    example: { situation: "A ligar para confirmar uma consulta", text: "\"Hi, this is Ana Silva. I'm calling to confirm my appointment for Friday.\"" },
  },
  {
    id: "small-talk-compliments",
    title: "Aceitar um elogio: diga só \"thank you\"",
    category: "small_talk",
    body:
      "Ao contrário do que acontece muitas vezes em português, onde é comum desvalorizar um elogio (\"não é nada de especial\"), em inglês o mais natural é simplesmente aceitar com um \"thank you\". Insistir muito em negar o elogio pode soar como se estivesse a pedir mais elogios, em vez de humildade.",
    example: { situation: "Alguém elogia a sua apresentação", text: "\"That was a great presentation!\" — \"Thank you, I really appreciate that.\"" },
  },
  {
    id: "register-formal-vs-informal-vocabulary",
    title: "Palavras diferentes para o mesmo significado, registos diferentes",
    category: "register",
    body:
      "Muitas ideias têm uma versão mais formal e outra mais informal em inglês, e não é só uma questão de gramática: \"purchase\" (formal) vs. \"buy\" (neutro), \"commence\" (muito formal) vs. \"start\" (neutro), \"assist\" (formal) vs. \"help\" (neutro). Usar a versão errada no contexto errado soa estranho, mesmo sendo gramaticalmente correto.",
    example: { situation: "A explicar o mesmo processo em dois contextos", text: "Email formal: \"Please assist the client with the purchase.\" · Conversa casual: \"Can you help him buy it?\"" },
  },
  {
    id: "etiquette-interrupting",
    title: "Interromper: peça licença primeiro",
    category: "etiquette",
    body:
      "Interromper alguém sem aviso soa mais rude em inglês do que muitas vezes em português informal. É comum usar uma frase curta antes de interromper: \"Sorry to interrupt, but...\", \"Can I just add something?\", ou \"Sorry, can I jump in here?\".",
    example: { situation: "Numa reunião, para acrescentar algo", text: "\"Sorry to interrupt, but I think we're missing an important point.\"" },
  },
];
