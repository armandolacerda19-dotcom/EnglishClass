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
];
