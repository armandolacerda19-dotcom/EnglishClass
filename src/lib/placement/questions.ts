// Banco de perguntas do placement test MVP1 — cobre os 8 pilares com dificuldade crescente.
// 5 pilares (grammar/vocabulary/listening/reading/translation) têm 5 perguntas
// (Pre-A1/A1 → A2 → B1 → B2 → C1) para estimar um teto aproximado sem exigir um
// motor de item-response completo (esse fica para MVP2, ver docs/10-scope-mvp1.md).
//
// Fase 13 (auditoria 2026-08-27) — o nível B2 (`content/curriculum/`) foi seedado
// nesta sessão, mas `averageToLevel` (scoring.ts) só conseguia colocar alguém em
// B1/B2 acertando tudo o resto, por falta de perguntas de dificuldade B2 próprias
// — heurística aceitável mas menos precisa. As 5 perguntas B2 (uma por pilar com
// correção exata) fecharam essa lacuna, testando pontos só ensinados nos módulos
// B2 (inversão, "deny doing something", etc.).
//
// Fase 15 (2026-08-27) — mesmo raciocínio ao introduzir C1: mais 5 perguntas de
// dificuldade C1, uma por pilar, testando pontos só ensinados nos módulos C1
// (subjuntivo formal, ênfase com do/does/did, relato passivo).
//
// Fase 18 (2026-08-28) — mesmo raciocínio ao introduzir C2: mais 5 perguntas de
// dificuldade C2, uma por pilar, testando pontos só ensinados nos módulos C2
// (inversão com advérbios negativos além do "never" básico de B2, fronting de
// objeto/complemento, construções absolutas com sujeito próprio).

export type PlacementPillar =
  | "grammar"
  | "vocabulary"
  | "listening"
  | "speaking"
  | "pronunciation"
  | "reading"
  | "writing"
  | "translation";

export interface PlacementQuestion {
  id: string;
  pillar: PlacementPillar;
  difficultyLevel: "PRE_A1" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
  prompt: string;
  options?: string[];
  correctAnswer: string;
  transcript?: string; // listening: lido em voz alta via Web Speech API (ver docs/decisions.md — sem ficheiros de áudio gravados no MVP1)
  freeResponse?: boolean; // speaking/writing: sem correção automática binária, avaliado por IA
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // Grammar
  { id: "pt_gr_1", pillar: "grammar", difficultyLevel: "A1", prompt: "She ___ to work every day.", options: ["go", "goes", "going", "gone"], correctAnswer: "goes" },
  { id: "pt_gr_2", pillar: "grammar", difficultyLevel: "A2", prompt: "I ___ my keys yesterday.", options: ["lose", "lost", "losed", "have lost"], correctAnswer: "lost" },
  { id: "pt_gr_3", pillar: "grammar", difficultyLevel: "B1", prompt: "If I ___ more time, I would learn French too.", options: ["have", "had", "will have", "having"], correctAnswer: "had" },
  { id: "pt_gr_4", pillar: "grammar", difficultyLevel: "B2", prompt: "Never ___ such a mess in my life.", options: ["have I seen", "I have seen", "did I see", "I saw"], correctAnswer: "have I seen" },
  { id: "pt_gr_5", pillar: "grammar", difficultyLevel: "C1", prompt: "It is essential that she ___ informed immediately.", options: ["be", "is", "will be", "being"], correctAnswer: "be" },
  { id: "pt_gr_6", pillar: "grammar", difficultyLevel: "C2", prompt: "Seldom ___ such enthusiasm among the whole team.", options: ["has anyone shown", "anyone has shown", "did anyone show", "anyone showed"], correctAnswer: "has anyone shown" },
  // Vocabulary
  { id: "pt_vo_1", pillar: "vocabulary", difficultyLevel: "A1", prompt: "Opposite of \"big\":", options: ["small", "tall", "long", "short"], correctAnswer: "small" },
  { id: "pt_vo_2", pillar: "vocabulary", difficultyLevel: "A2", prompt: "\"To make a decision\" means:", options: ["to decide", "to change your mind", "to ask a question", "to explain"], correctAnswer: "to decide" },
  { id: "pt_vo_3", pillar: "vocabulary", difficultyLevel: "B1", prompt: "\"Reach a deadline\" is closest in meaning to:", options: ["meet a deadline", "miss a deadline", "extend a deadline", "cancel a deadline"], correctAnswer: "meet a deadline" },
  { id: "pt_vo_4", pillar: "vocabulary", difficultyLevel: "B2", prompt: "\"To deny doing something\" means:", options: ["to say you did not do it", "to admit you did it", "to forget about it", "to apologize for it"], correctAnswer: "to say you did not do it" },
  { id: "pt_vo_5", pillar: "vocabulary", difficultyLevel: "C1", prompt: "\"Arguably\" is closest in meaning to:", options: ["it can reasonably be claimed that", "it is completely certain that", "it is impossible that", "nobody agrees that"], correctAnswer: "it can reasonably be claimed that" },
  { id: "pt_vo_6", pillar: "vocabulary", difficultyLevel: "C2", prompt: "\"Unprecedented\" is closest in meaning to:", options: ["never having happened before", "extremely common", "officially cancelled", "well planned in advance"], correctAnswer: "never having happened before" },
  // Listening
  { id: "pt_li_1", pillar: "listening", difficultyLevel: "A1", prompt: "Listen: what time is the meeting?", transcript: "The meeting is at ten o'clock, not eleven.", options: ["9am", "10am", "11am", "2pm"], correctAnswer: "10am" },
  { id: "pt_li_2", pillar: "listening", difficultyLevel: "A2", prompt: "Listen: where is the speaker going?", transcript: "I'm running late, my flight to Berlin leaves in two hours, so I need to get to the airport now.", options: ["airport", "station", "office", "hotel"], correctAnswer: "airport" },
  { id: "pt_li_3", pillar: "listening", difficultyLevel: "B1", prompt: "Listen: what is the main complaint?", transcript: "I ordered this three weeks ago and it still hasn't arrived. The item itself looks fine in the photos, I just need it to actually show up.", options: ["late delivery", "wrong item", "broken item", "no reply"], correctAnswer: "late delivery" },
  { id: "pt_li_4", pillar: "listening", difficultyLevel: "B2", prompt: "Listen: what did she do after finishing the report?", transcript: "Having finished the report, she went straight home instead of staying for the rest of the meeting.", options: ["went home", "stayed at the office", "went to another meeting", "called her boss"], correctAnswer: "went home" },
  { id: "pt_li_5", pillar: "listening", difficultyLevel: "C1", prompt: "Listen: is the speaker completely certain about their claim?", transcript: "It could be argued that remote work has changed office culture, though the full impact is still unclear.", options: ["no", "yes", "the speaker doesn't say"], correctAnswer: "no" },
  { id: "pt_li_6", pillar: "listening", difficultyLevel: "C2", prompt: "Listen: what condition does the speaker give?", transcript: "All things considered, we should proceed with the plan, provided that the budget is approved by Friday.", options: ["we should proceed if the budget is approved", "we should cancel the plan entirely", "the budget has already been approved"], correctAnswer: "we should proceed if the budget is approved" },
  // Reading
  { id: "pt_re_1", pillar: "reading", difficultyLevel: "A1", prompt: "\"The shop opens at 9am.\" — At what time does the shop open?", options: ["9am", "9pm", "10am", "It doesn't say"], correctAnswer: "9am" },
  { id: "pt_re_2", pillar: "reading", difficultyLevel: "A2", prompt: "\"Despite the rain, the match continued.\" — Did the match stop because of the rain?", options: ["No", "Yes", "It doesn't say", "Only for 10 minutes"], correctAnswer: "No" },
  { id: "pt_re_3", pillar: "reading", difficultyLevel: "B1", prompt: "\"The proposal was rejected, although it had strong initial support.\" — What happened to the proposal?", options: ["It was rejected", "It was approved", "It was postponed", "It was revised"], correctAnswer: "It was rejected" },
  { id: "pt_re_4", pillar: "reading", difficultyLevel: "B2", prompt: "\"It was the manager who cancelled the meeting, not the client.\" — Who cancelled the meeting?", options: ["The manager", "The client", "Both of them", "Neither"], correctAnswer: "The manager" },
  { id: "pt_re_5", pillar: "reading", difficultyLevel: "C1", prompt: "\"He is said to have left the country, though this has never been officially confirmed.\" — Has it been officially confirmed that he left?", options: ["No", "Yes", "It doesn't say"], correctAnswer: "No" },
  { id: "pt_re_6", pillar: "reading", difficultyLevel: "C2", prompt: "\"Weather permitting, the ceremony will take place outdoors.\" — What does this imply?", options: ["The ceremony depends on the weather", "The ceremony will happen regardless of weather", "The weather has already been confirmed good"], correctAnswer: "The ceremony depends on the weather" },
  // Translation
  { id: "pt_tr_1", pillar: "translation", difficultyLevel: "A1", prompt: "Translate: \"Eu tenho 30 anos.\"", correctAnswer: "I am 30 years old" },
  { id: "pt_tr_2", pillar: "translation", difficultyLevel: "A2", prompt: "Translate: \"Ela trabalha num banco desde 2019.\"", correctAnswer: "She has worked at a bank since 2019" },
  { id: "pt_tr_3", pillar: "translation", difficultyLevel: "B1", prompt: "Translate: \"Se eu tivesse mais tempo, viajava mais.\"", correctAnswer: "If I had more time, I would travel more" },
  { id: "pt_tr_4", pillar: "translation", difficultyLevel: "B2", prompt: "Translate: \"Devias ter-me avisado mais cedo.\"", correctAnswer: "You should have warned me earlier" },
  { id: "pt_tr_5", pillar: "translation", difficultyLevel: "C1", prompt: "Translate: \"É essencial que ele esteja presente na reunião.\"", correctAnswer: "It is essential that he be present at the meeting" },
  { id: "pt_tr_6", pillar: "translation", difficultyLevel: "C2", prompt: "Translate: \"Considerando tudo, a decisão foi correta.\"", correctAnswer: "All things considered, the decision was right" },
  // Speaking / Writing / Pronunciation — avaliados por IA, não por correspondência exata
  { id: "pt_sp_1", pillar: "speaking", difficultyLevel: "A2", prompt: "Record yourself: describe your job in 2-3 sentences.", correctAnswer: "", freeResponse: true },
  { id: "pt_wr_1", pillar: "writing", difficultyLevel: "A2", prompt: "Write 3 sentences about your last weekend.", correctAnswer: "", freeResponse: true },
  { id: "pt_pr_1", pillar: "pronunciation", difficultyLevel: "A1", prompt: "Record yourself reading: \"She works at a bank and commutes by train.\"", correctAnswer: "", freeResponse: true },
];
