// Rótulos e cor de acento por pilar — partilhado entre o Diagnóstico Semanal e as
// Sheets de tema, para a app deixar de usar sempre a mesma cor em todos os ecrãs
// de exercícios (feedback do utilizador, 2026-08-26: "as cores... nunca muda").
// Classes Tailwind completas e estáticas — o JIT não gera classes interpoladas.

export const PILLAR_LABEL: Record<string, string> = {
  GRAMMAR: "gramática",
  VOCABULARY: "vocabulário",
  LISTENING: "compreensão oral",
  READING: "leitura",
  TRANSLATION: "tradução",
  // Adicionados para cobrir os 8 pilares de LearningProfile.weakAreas — antes só
  // tinha os 5 do Diagnóstico Semanal, por isso "Áreas a reforçar" na Home/Progress
  // mostrava "speaking"/"pronunciation"/"writing" em inglês minúsculo sempre que
  // um destes três era a área mais fraca. Ver docs/decisions.md, auditoria 2026-08-26.
  SPEAKING: "fala",
  PRONUNCIATION: "pronúncia",
  WRITING: "escrita",
};

interface PillarAccent {
  text: string;
  bg: string;
  border: string;
  hoverBorder: string;
}

export const PILLAR_ACCENT: Record<string, PillarAccent> = {
  GRAMMAR: { text: "text-verdigris", bg: "bg-verdigris", border: "border-verdigris/30", hoverBorder: "hover:border-verdigris" },
  VOCABULARY: { text: "text-brass", bg: "bg-brass", border: "border-brass/30", hoverBorder: "hover:border-brass" },
  LISTENING: { text: "text-clay", bg: "bg-clay", border: "border-clay/30", hoverBorder: "hover:border-clay" },
  READING: { text: "text-verdigris", bg: "bg-verdigris", border: "border-verdigris/30", hoverBorder: "hover:border-verdigris" },
  TRANSLATION: { text: "text-brass", bg: "bg-brass", border: "border-brass/30", hoverBorder: "hover:border-brass" },
};

export const DEFAULT_ACCENT: PillarAccent = PILLAR_ACCENT.GRAMMAR!;
