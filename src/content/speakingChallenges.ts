// Desafio de Discurso Livre — tipo de exercício novo (Exercise Engine,
// achado crítico da auditoria de 2026-08-28: nenhum exercício levava o
// utilizador a falar 45-90s sem guião sobre um tema, o degrau que falta entre
// "conversa curta" e "conversação real"). Prompts por nível, mesma estrutura
// de tiers já usada em writingChallenges.ts, mas o alvo mínimo (em palavras
// faladas, não escritas) é mais baixo — falar é mais lento do que escrever.

export interface SpeakingChallengeItem {
  id: string;
  level: string;
  tier: "beginner" | "intermediate" | "advanced";
  prompt: string;
  promptPt: string;
  suggestedSeconds: number; // duração-alvo sugerida na UI, não um limite rígido
}

export const SPEAKING_CHALLENGE_ITEMS: SpeakingChallengeItem[] = [
  { id: "sc-01", level: "A1-A2", tier: "beginner", prompt: "Talk about your family for 45 seconds.", promptPt: "Fale sobre a sua família durante 45 segundos.", suggestedSeconds: 45 },
  { id: "sc-02", level: "A1-A2", tier: "beginner", prompt: "Describe your daily routine for 45 seconds.", promptPt: "Descreva a sua rotina diária durante 45 segundos.", suggestedSeconds: 45 },
  { id: "sc-03", level: "A1-A2", tier: "beginner", prompt: "Talk about your house or flat for 45 seconds.", promptPt: "Fale sobre a sua casa ou apartamento durante 45 segundos.", suggestedSeconds: 45 },
  { id: "sc-04", level: "B1-B2", tier: "intermediate", prompt: "Talk about your last holiday for about a minute.", promptPt: "Fale sobre as suas últimas férias durante cerca de um minuto.", suggestedSeconds: 60 },
  { id: "sc-05", level: "B1-B2", tier: "intermediate", prompt: "Talk about a skill you would like to learn and why, for about a minute.", promptPt: "Fale sobre uma competência que gostaria de aprender e porquê, durante cerca de um minuto.", suggestedSeconds: 60 },
  { id: "sc-06", level: "B1-B2", tier: "intermediate", prompt: "Describe a memorable event from your childhood for about a minute.", promptPt: "Descreva um acontecimento memorável da sua infância durante cerca de um minuto.", suggestedSeconds: 60 },
  { id: "sc-07", level: "C1", tier: "advanced", prompt: "Give your opinion about remote work for 90 seconds.", promptPt: "Dê a sua opinião sobre o trabalho remoto durante 90 segundos.", suggestedSeconds: 90 },
  { id: "sc-08", level: "C1", tier: "advanced", prompt: "Discuss the advantages and disadvantages of social media for 90 seconds.", promptPt: "Discuta as vantagens e desvantagens das redes sociais durante 90 segundos.", suggestedSeconds: 90 },
  { id: "sc-09", level: "C1", tier: "advanced", prompt: "Argue for or against artificial intelligence replacing jobs, for 90 seconds.", promptPt: "Argumente a favor ou contra a inteligência artificial substituir empregos, durante 90 segundos.", suggestedSeconds: 90 },
];

export function getSpeakingChallengeItem(id: string): SpeakingChallengeItem | undefined {
  return SPEAKING_CHALLENGE_ITEMS.find((s) => s.id === id);
}
