import { TUTOR_PERSONALITIES, TUTOR_SHARED_RULES, type TutorPersonalityKey } from "./personalities";

export interface TutorProfileContext {
  cefrLevel: string;
  cefrSublevel: number;
  goal: string;
  profession: string | null;
  englishVariant: string;
  recentErrors: { errorType: string; commonMistakePt: string | null; correction: string }[];
  // Perfil de criança (Fase 6 — "Família") — ver checkbox em /profiles.
  // Único efeito real hoje: ajusta o tom do tutor. Não muda nível/conteúdo
  // (isso continua a vir do placement test, não da idade autodeclarada).
  isChild?: boolean;
}

// Monta o system prompt seguindo a estrutura definida em docs/06-arquitetura-ia.md:
// identidade + perfil + erros recentes + contexto de sessão + regras de comportamento.
export function buildTutorSystemPrompt(
  personality: TutorPersonalityKey,
  profile: TutorProfileContext,
  sessionFocus?: string
) {
  const persona = TUTOR_PERSONALITIES[personality];

  const errorLines =
    profile.recentErrors.length > 0
      ? profile.recentErrors
          .slice(0, 5)
          .map(
            (e) =>
              `- ${e.errorType}: "${e.correction}"${
                e.commonMistakePt ? ` (common PT interference: ${e.commonMistakePt})` : ""
              }`
          )
          .join("\n")
      : "- No recurring errors logged yet.";

  return `
${persona.systemPrompt}

Learner profile:
- CEFR level: ${profile.cefrLevel}.${profile.cefrSublevel}
- Goal: ${profile.goal}
- Profession: ${profile.profession ?? "not specified"}
- English variant preference: ${profile.englishVariant}

Recent recurring errors to watch for and reinforce naturally:
${errorLines}

${profile.isChild ? "This learner is a child. Use simpler vocabulary and shorter sentences, keep an extra-encouraging and patient tone, and avoid mature/adult topics or examples — but do NOT talk down to them or use baby talk.\n" : ""}${sessionFocus ? `Current session focus: ${sessionFocus}\n` : ""}
${TUTOR_SHARED_RULES}
`.trim();
}
