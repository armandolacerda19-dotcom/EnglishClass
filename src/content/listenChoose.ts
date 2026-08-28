// Ouvir e Escolher — tipo de exercício novo (Exercise Engine, prioridade 🟡
// do relatório de 2026-08-28). Progressão formal por camada: Iniciante (uma
// palavra/frase curta, áudio lento por omissão), Intermédio (frase completa,
// velocidade natural), Avançado (mini-diálogo com mais contexto e
// naturalidade, velocidade natural sem desaceleração por omissão). A
// variedade de sotaque já existe via seletor de voz (Definições) — aqui só
// se formaliza a progressão de velocidade/complexidade por nível.

export interface ListenChooseItem {
  id: string;
  tier: "beginner" | "intermediate" | "advanced";
  level: string;
  transcript: string;
  question: string;
  options: string[];
  correct: string;
}

export const LISTEN_CHOOSE_ITEMS: ListenChooseItem[] = [
  { id: "lc-01", tier: "beginner", level: "A1", transcript: "The meeting is at ten o'clock.", question: "What time is the meeting?", options: ["9am", "10am", "11am"], correct: "10am" },
  { id: "lc-02", tier: "beginner", level: "A1", transcript: "My sister is a doctor.", question: "What is the speaker's sister?", options: ["A teacher", "A doctor", "A nurse"], correct: "A doctor" },
  { id: "lc-03", tier: "beginner", level: "A1", transcript: "I have two brothers and one sister.", question: "How many brothers does the speaker have?", options: ["One", "Two", "Three"], correct: "Two" },
  { id: "lc-04", tier: "beginner", level: "A2", transcript: "The train to Porto leaves from platform four.", question: "Which platform does the train leave from?", options: ["Platform two", "Platform three", "Platform four"], correct: "Platform four" },
  { id: "lc-05", tier: "intermediate", level: "B1", transcript: "I'm running late, my flight to Berlin leaves in two hours, so I need to get to the airport now.", question: "Where is the speaker going right now?", options: ["To the airport", "To the train station", "To the office"], correct: "To the airport" },
  { id: "lc-06", tier: "intermediate", level: "B1", transcript: "I ordered this three weeks ago and it still hasn't arrived, even though the item itself looks fine in the photos.", question: "What is the main complaint?", options: ["Late delivery", "Wrong item", "Broken item"], correct: "Late delivery" },
  { id: "lc-07", tier: "intermediate", level: "B1", transcript: "Having finished the report, she went straight home instead of staying for the rest of the meeting.", question: "What did she do after finishing the report?", options: ["Went home", "Stayed at the meeting", "Called her boss"], correct: "Went home" },
  { id: "lc-08", tier: "intermediate", level: "B2", transcript: "It was the manager who cancelled the meeting, not the client, even though everyone assumed it was the other way round.", question: "Who cancelled the meeting?", options: ["The manager", "The client", "Neither of them"], correct: "The manager" },
  { id: "lc-09", tier: "advanced", level: "B2", transcript: "A: Did you hear back about the job? B: Yeah, actually, they offered it to me, but I'm still weighing it up against the other offer.", question: "What is speaker B doing about the job offer?", options: ["Accepting it immediately", "Still deciding", "Rejecting it"], correct: "Still deciding" },
  { id: "lc-10", tier: "advanced", level: "C1", transcript: "A: So how did the presentation go? B: Honestly? Could've gone better — the client kept interrupting with questions we hadn't prepped for.", question: "According to speaker B, why didn't the presentation go well?", options: ["The client asked unexpected questions", "The client left early", "The equipment failed"], correct: "The client asked unexpected questions" },
  { id: "lc-11", tier: "advanced", level: "C1", transcript: "It could be argued that remote work has changed office culture, though the full impact is still unclear at this stage.", question: "Is the speaker completely certain about their claim?", options: ["Yes, completely certain", "No, it's presented as a possibility", "The speaker doesn't say"], correct: "No, it's presented as a possibility" },
  { id: "lc-12", tier: "advanced", level: "C1", transcript: "A: We really need to cut costs this quarter. B: Sure, but not at the expense of quality — that's a false economy in the long run.", question: "What is speaker B's main concern?", options: ["Cutting costs too aggressively could hurt quality", "The company has no money left", "Speaker A is wrong about everything"], correct: "Cutting costs too aggressively could hurt quality" },
];

export function getListenChooseItem(id: string): ListenChooseItem | undefined {
  return LISTEN_CHOOSE_ITEMS.find((l) => l.id === id);
}
