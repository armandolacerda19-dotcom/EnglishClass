// Feedback fonético PT→EN — auditoria secção 294 ("feedback fonético PT→EN").
// O feedback de speaking (learn/actions.ts) já dá dicas pontuais inferidas do
// transcript, mas isso só aparece depois de um erro específico acontecer.
// Isto é a referência oposta: os padrões mais comuns e previsíveis de
// interferência do português na pronúncia do inglês, explicados uma vez,
// para consultar antes de precisar. Mesmo padrão estático de
// culturalTips.ts/sentencePatterns.ts, sem schema/seed novo. Cada exemplo
// pode ser ouvido via PlayTranscript (Web Speech API), a mesma síntese de
// voz já usada em toda a app.

export interface PronunciationTip {
  id: string;
  title: string;
  explanationPt: string;
  examples: string[];
  // Fase 13 (auditoria 2026-08-27, veredito honesto): "o que falta para
  // perceber filmes/música é, por ordem: áudio humano real, currículo até B2
  // com fonologia de fala ligada, e material autêntico". Os 8 itens
  // originais são todos sobre SONS individuais (fonemas isolados); nunca
  // havia nada sobre como as palavras se ligam/reduzem na fala corrida —
  // exatamente o que torna filmes/conversas reais difíceis de seguir mesmo
  // para quem já domina a gramática e o vocabulário. Campo opcional e
  // retrocompatível: os 8 itens antigos continuam sem `category` (tratados
  // como "sound" por omissão na página), só os novos a preenchem.
  category?: "sound" | "connected-speech";
}

export const PRONUNCIATION_TIPS: PronunciationTip[] = [
  {
    id: "th-sound",
    title: "O som de TH (think / this)",
    explanationPt:
      "O português não tem este som — a tendência natural é substituí-lo por /t/, /d/ ou /f/ (\"tink\", \"dis\", \"free\" em vez de \"three\"). A língua deve tocar de leve nos dentes da frente, deixando o ar passar, sem fechar completamente como no /t/ ou /d/.",
    examples: ["think", "this", "three", "mother", "birthday"],
  },
  {
    id: "final-consonants",
    title: "Consoantes no fim da palavra",
    explanationPt:
      "Em português quase todas as sílabas acabam em vogal; em inglês é normal terminar em consoante forte (\"walked\", \"stopped\", \"cats\"). A tendência é engolir ou suavizar essa consoante final — mas em inglês ela muda o significado (\"walk\" vs. \"walked\") e precisa de se ouvir.",
    examples: ["walked", "stopped", "cats", "worked", "asked"],
  },
  {
    id: "word-stress",
    title: "Acento tónico na sílaba errada",
    explanationPt:
      "O inglês muda de significado consoante a sílaba acentuada (\"PREsent\" o substantivo vs. \"preSENT\" o verbo), e falantes de português tendem a acentuar de forma mais uniforme, como no português. Ouvir e exagerar a sílaba tónica ajuda a fixar o padrão.",
    examples: ["present (noun)", "present (verb)", "record (noun)", "record (verb)", "photograph", "photographer"],
  },
  {
    id: "short-long-vowels",
    title: "Vogais curtas vs. longas (ship / sheep)",
    explanationPt:
      "O português não distingue vogais curtas e longas da mesma forma — \"ship\" (barco) e \"sheep\" (ovelha) soam quase iguais para muitos falantes de português, mas são palavras completamente diferentes em inglês. A vogal longa dura visivelmente mais tempo.",
    examples: ["ship / sheep", "live / leave", "full / fool", "bit / beat"],
  },
  {
    id: "r-sound",
    title: "O R inglês (não é o R português)",
    explanationPt:
      "O R do português (vibrante, como em \"carro\" ou \"rato\") é muito diferente do R inglês, que é mais suave, sem vibração, com a língua enrolada para trás sem tocar no céu da boca. Usar o R português soa marcadamente estrangeiro em palavras como \"red\" ou \"really\".",
    examples: ["red", "really", "right", "world", "restaurant"],
  },
  {
    id: "silent-letters",
    title: "Letras que não se pronunciam",
    explanationPt:
      "Ao contrário do português, onde quase tudo o que se escreve se lê, o inglês tem muitas letras mudas — ler cada letra escrita produz uma pronúncia claramente errada.",
    examples: ["know", "island", "hour", "listen", "Wednesday"],
  },
  {
    id: "s-clusters",
    title: "S + consoante no início da palavra",
    explanationPt:
      "Em português, \"esp-\", \"est-\", \"esc-\" têm sempre um \"e\" antes — a tendência natural é dizer \"eschool\", \"espeak\", \"estudent\" em inglês também. Mas o inglês começa diretamente pelo S, sem vogal antes.",
    examples: ["school", "speak", "student", "Spain", "stop"],
  },
  {
    id: "ed-endings",
    title: "A terminação -ED nem sempre soa igual",
    explanationPt:
      "\"-ed\" tem 3 sons diferentes consoante a letra anterior: /t/ depois de som surdo (\"walked\"), /d/ depois de som sonoro (\"played\"), e /ɪd/ depois de T ou D (\"wanted\", \"needed\"). Usar sempre o mesmo som para todos soa estrangeiro.",
    examples: ["walked", "played", "wanted", "needed", "stopped"],
  },
  // Fase 13 (2026-08-27) — fonologia de fala ligada (connected speech): o que
  // realmente separa "entender uma frase isolada devagar" de "acompanhar um
  // filme ou uma conversa real à velocidade normal".
  {
    id: "linking-consonant-vowel",
    title: "Ligar consoante final a vogal seguinte (linking)",
    explanationPt:
      "Quando uma palavra acaba em consoante e a seguinte começa por vogal, o inglês falado natural liga as duas como se fossem uma só palavra: \"turn it off\" soa a \"tur-ni-toff\", \"an apple\" soa a \"a-napple\". Aprender a ouvir isto — e não cada palavra separada, com uma pausa entre elas — é essencial para perceber falantes nativos e filmes: sem legendas, o cérebro tenta separar palavras que na fala real estão coladas.",
    examples: ["turn it off", "an apple", "not at all", "wake up"],
    category: "connected-speech",
  },
  {
    id: "weak-forms",
    title: "Formas fracas das palavras funcionais (to, for, of, was...)",
    explanationPt:
      "Palavras gramaticais curtas (to, for, of, and, was, were, can, than) quase nunca se pronunciam com a vogal \"cheia\" do dicionário na fala corrida — reduzem-se a um som neutro e rápido (schwa, /ə/). \"I want to go\" soa a \"I wanna go\" e \"a cup of tea\" soa a \"a cup uh tea\". Quem só ouviu a forma forte destas palavras (a forma ensinada isoladamente) acha a fala real confusa e rápida demais — mas é a forma fraca, não a forte, que é normal na conversa.",
    examples: ["want to", "a cup of tea", "he can go", "black and white"],
    category: "connected-speech",
  },
  {
    id: "elision-t-d",
    title: "Desaparecimento do T/D entre consoantes (elision)",
    explanationPt:
      "Quando /t/ ou /d/ aparece entre duas outras consoantes, é normal desaparecer quase por completo na fala rápida: \"next day\" soa a \"nex day\", \"must be\" soa a \"mus be\". Isto não é um erro do falante nativo nem uma pronúncia descuidada — é o padrão normal, e reconhecer que o som \"desapareceu\" de propósito é o que permite continuar a acompanhar uma conversa rápida ou um filme sem se perder.",
    examples: ["next day", "must be", "last chance", "kept quiet"],
    category: "connected-speech",
  },
  {
    id: "informal-contractions",
    title: "Contrações informais faladas (gonna, wanna, gotta)",
    explanationPt:
      "Em fala casual e em filmes/séries, \"going to\" soa quase sempre a \"gonna\", \"want to\" a \"wanna\", e \"got to\"/\"have got to\" a \"gotta\" — mesmo entre falantes cultos, fora de contextos formais. Estas formas nunca se escrevem assim num email ou documento formal, mas reconhecê-las de ouvido é indispensável para perceber diálogo real, onde aparecem constantemente.",
    examples: ["going to", "want to", "got to", "kind of"],
    category: "connected-speech",
  },
  {
    id: "intrusive-sounds",
    title: "Sons de ligação entre vogais (intrusive R/Y/W)",
    explanationPt:
      "Quando uma palavra termina em vogal e a seguinte começa por vogal, falantes nativos inserem um som de ligação quase impercetível para evitar duas vogais coladas sem nada entre elas: \"law and order\" ganha um /r/ entre \"law\" e \"and\" (mesmo sem haver R escrito), \"go on\" ganha um leve /w/, \"she asked\" ganha um leve /j/. Não é um erro nem uma letra a mais — é o inglês a suavizar a transição entre duas vogais.",
    examples: ["law and order", "go on", "she asked", "media event"],
    category: "connected-speech",
  },
];
