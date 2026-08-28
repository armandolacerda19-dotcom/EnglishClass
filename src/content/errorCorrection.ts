// Correção de Erros — tipo de exercício novo (Exercise Engine, 2026-08-28).
// Frase com um erro real e comum de falantes de português; o utilizador tem
// de a reescrever corrigida. `errorType` alimenta UserError (mesma
// granularidade de tags já usada nos módulos de currículo) para o erro
// entrar na fila de revisão espaçada se o utilizador falhar.

export interface ErrorCorrectionItem {
  id: string;
  level: string;
  wrong: string;
  correct: string;
  explanation: string;
  errorType: string;
}

export const ERROR_CORRECTION_ITEMS: ErrorCorrectionItem[] = [
  {
    id: "ec-01",
    level: "A1",
    wrong: "He don't like coffee.",
    correct: "He doesn't like coffee.",
    explanation: "3ª pessoa do singular usa \"doesn't\", não \"don't\".",
    errorType: "3rd-person-negative",
  },
  {
    id: "ec-02",
    level: "A1",
    wrong: "She is have two brothers.",
    correct: "She has two brothers.",
    explanation: "\"Have\" já é o verbo principal — não se junta a \"is\".",
    errorType: "verb-be-confusion",
  },
  {
    id: "ec-03",
    level: "A1",
    wrong: "I am agree with you.",
    correct: "I agree with you.",
    explanation: "\"Agree\" é um verbo, não um adjetivo — não precisa de \"am\".",
    errorType: "verb-be-confusion",
  },
  {
    id: "ec-04",
    level: "A2",
    wrong: "I have 30 years old.",
    correct: "I am 30 years old.",
    explanation: "Idade em inglês usa \"to be\", não \"to have\" (ao contrário do português).",
    errorType: "age-be-have",
  },
  {
    id: "ec-05",
    level: "A2",
    wrong: "She go to work by car every day.",
    correct: "She goes to work by car every day.",
    explanation: "3ª pessoa do singular no Present Simple leva \"-s\": \"goes\".",
    errorType: "3rd-person-s",
  },
  {
    id: "ec-06",
    level: "A2",
    wrong: "I am living in Lisbon since 2019.",
    correct: "I have lived in Lisbon since 2019.",
    explanation: "\"Since\" com uma situação que continua pede Present Perfect, não Present Continuous.",
    errorType: "present-perfect-since",
  },
  {
    id: "ec-07",
    level: "A2",
    wrong: "She married with him last year.",
    correct: "She married him last year.",
    explanation: "\"Marry\" não leva preposição em inglês: \"marry someone\", não \"marry with someone\".",
    errorType: "verb-preposition",
  },
  {
    id: "ec-08",
    level: "A2",
    wrong: "I'm looking forward to see you.",
    correct: "I'm looking forward to seeing you.",
    explanation: "\"Look forward to\" é seguido de gerúndio (\"-ing\"), não infinitivo.",
    errorType: "gerund-after-preposition",
  },
  {
    id: "ec-09",
    level: "B1",
    wrong: "If I will have time, I will call you.",
    correct: "If I have time, I will call you.",
    explanation: "Na oração com \"if\" do First Conditional, usa-se Present Simple, nunca \"will\".",
    errorType: "conditional-if-will",
  },
  {
    id: "ec-10",
    level: "B1",
    wrong: "I have seen that film yesterday.",
    correct: "I saw that film yesterday.",
    explanation: "Com uma data específica (\"yesterday\"), usa-se Past Simple, não Present Perfect.",
    errorType: "past-simple-vs-perfect",
  },
  {
    id: "ec-11",
    level: "B1",
    wrong: "She explained me the problem.",
    correct: "She explained the problem to me.",
    explanation: "\"Explain\" não aceita objeto indireto direto — precisa de \"to me\".",
    errorType: "verb-pattern",
  },
  {
    id: "ec-12",
    level: "B1",
    wrong: "I'm interesting in learning Japanese.",
    correct: "I'm interested in learning Japanese.",
    explanation: "\"Interested\" descreve quem sente o interesse; \"interesting\" descreve o que causa o interesse.",
    errorType: "ed-ing-adjectives",
  },
  {
    id: "ec-13",
    level: "B1",
    wrong: "He is working here since 2020.",
    correct: "He has been working here since 2020.",
    explanation: "Ação que começou no passado e continua até agora pede Present Perfect Continuous.",
    errorType: "present-perfect-continuous",
  },
  {
    id: "ec-14",
    level: "B1",
    wrong: "I look forward to hear from you.",
    correct: "I look forward to hearing from you.",
    explanation: "Mesmo erro comum de \"look forward to\" + gerúndio, não infinitivo.",
    errorType: "gerund-after-preposition",
  },
  {
    id: "ec-15",
    level: "B2",
    wrong: "The report was wrote by the intern.",
    correct: "The report was written by the intern.",
    explanation: "Voz passiva usa o particípio passado (\"written\"), não o Past Simple (\"wrote\").",
    errorType: "passive-voice-participle",
  },
  {
    id: "ec-16",
    level: "B2",
    wrong: "If I would have known, I would have helped.",
    correct: "If I had known, I would have helped.",
    explanation: "Third Conditional: a oração com \"if\" usa Past Perfect, nunca \"would have\".",
    errorType: "third-conditional",
  },
  {
    id: "ec-17",
    level: "B2",
    wrong: "She suggested me to apply for the job.",
    correct: "She suggested that I apply for the job.",
    explanation: "\"Suggest\" não aceita objeto + infinitivo — usa-se \"suggest that...\" ou \"suggest + gerúndio\".",
    errorType: "verb-pattern",
  },
  {
    id: "ec-18",
    level: "B2",
    wrong: "Despite of the rain, we went out.",
    correct: "Despite the rain, we went out.",
    explanation: "\"Despite\" nunca leva \"of\" a seguir — só \"in spite of\" tem \"of\".",
    errorType: "preposition-despite",
  },
  {
    id: "ec-19",
    level: "C1",
    wrong: "It's essential that he attends the meeting tomorrow, isn't it?",
    correct: "It's essential that he attend the meeting tomorrow, isn't it?",
    explanation: "Depois de \"essential that\", usa-se o subjuntivo (forma base \"attend\"), não \"attends\".",
    errorType: "subjunctive",
  },
  {
    id: "ec-20",
    level: "C1",
    wrong: "Not until she arrived we started the meeting.",
    correct: "Not until she arrived did we start the meeting.",
    explanation: "\"Not until\" no início da frase exige inversão (auxiliar antes do sujeito): \"did we start\".",
    errorType: "inversion",
  },
];

export function getErrorCorrectionItem(id: string): ErrorCorrectionItem | undefined {
  return ERROR_CORRECTION_ITEMS.find((e) => e.id === id);
}
