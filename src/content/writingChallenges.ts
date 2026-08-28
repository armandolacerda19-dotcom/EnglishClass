// Desafio de Escrita Livre — tipo de exercício novo (Exercise Engine,
// prioridade 🟠 do relatório de 2026-08-28). Prompts por nível, exatamente
// como pedido: Beginner/Intermediate/Advanced.

export interface WritingChallengeItem {
  id: string;
  level: string;
  tier: "beginner" | "intermediate" | "advanced";
  prompt: string;
  promptPt: string;
}

export const WRITING_CHALLENGE_ITEMS: WritingChallengeItem[] = [
  { id: "wc-01", level: "A1-A2", tier: "beginner", prompt: "Describe your family in 5 sentences.", promptPt: "Descreva a sua família em 5 frases." },
  { id: "wc-02", level: "A1-A2", tier: "beginner", prompt: "Describe your daily routine in 5 sentences.", promptPt: "Descreva a sua rotina diária em 5 frases." },
  { id: "wc-03", level: "A1-A2", tier: "beginner", prompt: "Describe your house or flat in 5 sentences.", promptPt: "Descreva a sua casa ou apartamento em 5 frases." },
  { id: "wc-04", level: "B1-B2", tier: "intermediate", prompt: "Describe your last holiday.", promptPt: "Descreva as suas últimas férias." },
  { id: "wc-05", level: "B1-B2", tier: "intermediate", prompt: "Write about a skill you would like to learn and why.", promptPt: "Escreva sobre uma competência que gostaria de aprender e porquê." },
  { id: "wc-06", level: "B1-B2", tier: "intermediate", prompt: "Describe a memorable event from your childhood.", promptPt: "Descreva um acontecimento memorável da sua infância." },
  { id: "wc-07", level: "C1", tier: "advanced", prompt: "Give your opinion about remote work.", promptPt: "Dê a sua opinião sobre o trabalho remoto." },
  { id: "wc-08", level: "C1", tier: "advanced", prompt: "Discuss the advantages and disadvantages of social media.", promptPt: "Discuta as vantagens e desvantagens das redes sociais." },
  { id: "wc-09", level: "C1", tier: "advanced", prompt: "Argue for or against artificial intelligence replacing jobs.", promptPt: "Argumente a favor ou contra a inteligência artificial substituir empregos." },
];

export function getWritingChallengeItem(id: string): WritingChallengeItem | undefined {
  return WRITING_CHALLENGE_ITEMS.find((w) => w.id === id);
}
