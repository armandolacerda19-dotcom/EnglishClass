// Leitura extensiva — item da crítica de produto (2026-08-26) sinalizado como alto
// impacto: exposição a texto conectado (não frases isoladas) é um dos maiores
// preditores de aquisição de língua. Conteúdo estático (não passa pelo schema
// Exercise/Lesson) para não exigir alterações de schema nem seed — mais rápido
// de expandir no futuro, basta acrescentar entradas a este array.

export interface ReadingQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
}

export interface ReadingPassage {
  id: string;
  title: string;
  level: string;
  text: string;
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "morning-at-the-cafe",
    title: "A Morning at the Café",
    level: "A1",
    text: "Every morning, Sofia walks to the small café near her house. She always orders a coffee and a croissant. The café is quiet before 8am, so she likes to read the news there. Today, she meets her friend Paulo, and they talk about their weekend plans. Paulo wants to go to the beach, but Sofia prefers to stay in the city.",
    questions: [
      {
        id: "q1",
        prompt: "Where does Sofia go every morning?",
        options: ["To a small café", "To the beach", "To her office", "To the gym"],
        correctAnswer: "To a small café",
      },
      {
        id: "q2",
        prompt: "What does Sofia usually order?",
        options: ["Tea and toast", "A coffee and a croissant", "Juice and eggs", "Just water"],
        correctAnswer: "A coffee and a croissant",
      },
      {
        id: "q3",
        prompt: "What does Paulo want to do this weekend?",
        options: ["Stay in the city", "Go to the beach", "Read the news", "Work"],
        correctAnswer: "Go to the beach",
      },
    ],
  },
  {
    id: "annas-weekend",
    title: "Anna's Weekend",
    level: "A1",
    text: "Last weekend, Anna had a lot of free time. On Saturday, she woke up late and cleaned her apartment. In the afternoon, she visited her parents and had lunch with them. On Sunday, she went for a long walk in the park with her dog. In the evening, she cooked pasta and watched a movie with her sister.",
    questions: [
      {
        id: "q1",
        prompt: "What did Anna do on Saturday morning?",
        options: ["She went for a walk", "She woke up late and cleaned her apartment", "She cooked pasta", "She visited her parents"],
        correctAnswer: "She woke up late and cleaned her apartment",
      },
      {
        id: "q2",
        prompt: "Who did Anna have lunch with?",
        options: ["Her sister", "Her dog", "Her parents", "Her friend"],
        correctAnswer: "Her parents",
      },
      {
        id: "q3",
        prompt: "What did Anna do on Sunday evening?",
        options: ["She went for a walk", "She cleaned her apartment", "She cooked pasta and watched a movie", "She visited her parents"],
        correctAnswer: "She cooked pasta and watched a movie",
      },
    ],
  },
  {
    id: "toms-new-job",
    title: "Tom's New Job",
    level: "A1",
    text: "Tom started a new job last month. He works in an office in the city centre, and he commutes by train every day. His new manager is friendly and helpful. Tom's job is difficult, but he is learning a lot. On his first day, he was very nervous, but now he feels more confident. He usually has lunch with his colleagues at a restaurant near the office.",
    questions: [
      {
        id: "q1",
        prompt: "How does Tom get to work?",
        options: ["By car", "By train", "He walks", "By bicycle"],
        correctAnswer: "By train",
      },
      {
        id: "q2",
        prompt: "How did Tom feel on his first day?",
        options: ["Confident", "Bored", "Very nervous", "Angry"],
        correctAnswer: "Very nervous",
      },
      {
        id: "q3",
        prompt: "Where does Tom usually have lunch?",
        options: ["At home", "At a restaurant near the office", "In the park", "At his manager's house"],
        correctAnswer: "At a restaurant near the office",
      },
    ],
  },
];
