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
  // Pré-compostas para o estado "já correto"/"desativado" que alguns Runners
  // precisam (ex. MatchingRunner) — nunca interpolar `${accent.bg}/10` em tempo
  // de execução: o JIT do Tailwind só gera classes que aparecem completas e
  // literais no código-fonte (mesma regra do comentário acima do ficheiro).
  bgSoft: string;
  textSoft: string;
}

// 5ª auditoria (2026-09-01, docs/09-sistema-design.md "Cor por pilar") — antes só
// 3 cores (verdigris/brass/clay) cobriam os 8 pilares: GRAMMAR e READING eram
// indistinguíveis entre si, o mesmo para VOCABULARY/TRANSLATION, e LISTENING
// pedia Clay emprestado — a única cor que o sistema de design reserva
// exclusivamente para marcar erros PT→EN (ErrorCallout), nunca para uso
// decorativo. Cada pilar tem agora a sua própria cor; Clay deixa de aparecer
// aqui. Ver tailwind.config.ts para os hex.
export const PILLAR_ACCENT: Record<string, PillarAccent> = {
  GRAMMAR: { text: "text-verdigris", bg: "bg-verdigris", border: "border-verdigris/30", hoverBorder: "hover:border-verdigris", bgSoft: "bg-verdigris/10", textSoft: "text-verdigris/50" },
  VOCABULARY: { text: "text-brass", bg: "bg-brass", border: "border-brass/30", hoverBorder: "hover:border-brass", bgSoft: "bg-brass/10", textSoft: "text-brass/50" },
  LISTENING: { text: "text-teal", bg: "bg-teal", border: "border-teal/30", hoverBorder: "hover:border-teal", bgSoft: "bg-teal/10", textSoft: "text-teal/50" },
  READING: { text: "text-moss", bg: "bg-moss", border: "border-moss/30", hoverBorder: "hover:border-moss", bgSoft: "bg-moss/10", textSoft: "text-moss/50" },
  TRANSLATION: { text: "text-berry", bg: "bg-berry", border: "border-berry/30", hoverBorder: "hover:border-berry", bgSoft: "bg-berry/10", textSoft: "text-berry/50" },
  SPEAKING: { text: "text-indigo", bg: "bg-indigo", border: "border-indigo/30", hoverBorder: "hover:border-indigo", bgSoft: "bg-indigo/10", textSoft: "text-indigo/50" },
  PRONUNCIATION: { text: "text-plum", bg: "bg-plum", border: "border-plum/30", hoverBorder: "hover:border-plum", bgSoft: "bg-plum/10", textSoft: "text-plum/50" },
  WRITING: { text: "text-slate", bg: "bg-slate", border: "border-slate/30", hoverBorder: "hover:border-slate", bgSoft: "bg-slate/10", textSoft: "text-slate/50" },
};

export const DEFAULT_ACCENT: PillarAccent = PILLAR_ACCENT.GRAMMAR!;

// Nome do ícone (PillarIcon.tsx) associado a cada pilar — par com PILLAR_ACCENT
// para que cor+forma identifiquem sempre o mesmo pilar em toda a app, não só a
// cor (acessibilidade: não depender só de cor para distinguir informação).
export type PillarIconName = "grammar" | "vocabulary" | "listening" | "reading" | "translation" | "speaking" | "pronunciation" | "writing";

export const PILLAR_ICON: Record<string, PillarIconName> = {
  GRAMMAR: "grammar",
  VOCABULARY: "vocabulary",
  LISTENING: "listening",
  READING: "reading",
  TRANSLATION: "translation",
  SPEAKING: "speaking",
  PRONUNCIATION: "pronunciation",
  WRITING: "writing",
};
