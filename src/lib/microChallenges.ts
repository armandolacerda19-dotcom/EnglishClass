// Micro-desafios — momentos curtos ao longo do dia (pedido do utilizador, 2026-08-26,
// ver PROJECT_STATE.md). Complementam o Desafio Diário de vocabulário (que é o checkpoint
// formal do dia) com engagement leve, sem exigir atenção total ao ecrã.

interface ShadowChallenge {
  id: string;
  kind: "shadow";
  title: string;
  subtitle: string;
  sentence: string;
  translation: string;
}

interface ListenChallenge {
  id: string;
  kind: "listen";
  title: string;
  subtitle: string;
  dialogue: string[];
  question: string;
  options: string[];
  correctIndex: number;
}

export type MicroChallenge = ShadowChallenge | ListenChallenge;

export const MICRO_CHALLENGES: MicroChallenge[] = [
  {
    id: "morning",
    kind: "shadow",
    title: "5 Minutos Matinais",
    subtitle: "Assim que acordar — ouça e repita uma frase para começar o dia em inglês.",
    sentence: "Today is going to be a good day.",
    translation: "Hoje vai ser um bom dia.",
  },
  {
    id: "bathroom",
    kind: "shadow",
    title: "Casa de Banho",
    subtitle: "Enquanto lava os dentes — ouça e repita, sem precisar de olhar para o ecrã.",
    sentence: "I brush my teeth every morning and every night.",
    translation: "Eu escovo os dentes todas as manhãs e todas as noites.",
  },
  {
    id: "couch",
    kind: "listen",
    title: "Sofá",
    subtitle: "Um momento parado — ouça o diálogo e responda a uma pergunta.",
    dialogue: [
      "A: Are you free this weekend?",
      "B: Yes, I don't have any plans yet.",
      "A: Great, do you want to have dinner on Saturday?",
    ],
    question: "What does B say about the weekend?",
    options: ["B has no plans", "B is working", "B is traveling", "B doesn't want to meet"],
    correctIndex: 0,
  },
  {
    id: "waiting",
    kind: "shadow",
    title: "Fila de Espera",
    subtitle: "À espera de algo (transportes, consulta, loja) — ouça e repita baixinho.",
    sentence: "Excuse me, do you know how long the wait is?",
    translation: "Desculpe, sabe quanto tempo é a espera?",
  },
  {
    id: "before-bed",
    kind: "listen",
    title: "Antes de Dormir",
    subtitle: "Últimos minutos do dia — ouça o diálogo e responda a uma pergunta.",
    dialogue: [
      "A: How was your day?",
      "B: Pretty good, actually. I finished a big project at work.",
      "A: That's great, you must be relieved.",
    ],
    question: "How does B feel about finishing the project?",
    options: ["Relieved", "Angry", "Bored", "Confused"],
    correctIndex: 0,
  },
];

export function getMicroChallenge(id: string): MicroChallenge | undefined {
  return MICRO_CHALLENGES.find((c) => c.id === id);
}
