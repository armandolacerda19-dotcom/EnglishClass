import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { TUTOR_PERSONALITIES } from "@/lib/ai/personalities";

const DESCRIPTIONS: Record<string, string> = {
  coach: "Feedback direto com memória dos seus erros recorrentes — o ponto de partida.",
  conversation_partner: "Conversa livre e casual, ao ritmo de um diálogo real.",
  interviewer: "Simula uma entrevista de emprego em inglês — pergunta a pergunta, como na vida real.",
  native_friend: "Conversa informal, cheia de expressões idiomáticas explicadas ao longo do caminho.",
  roleplay: "Cenários práticos do dia a dia — pratique as frases certas para cada situação.",
};

// Setores para a entrevista — item #14 da lista de melhorias (inglês
// profissional por setor). Continua genérico se nenhum for escolhido.
const INTERVIEW_SECTORS = [
  { key: "tech", label: "Tecnologia" },
  { key: "healthcare", label: "Saúde" },
  { key: "sales", label: "Vendas / Negócios" },
  { key: "hospitality", label: "Hotelaria / Turismo" },
];

// Cenários de roleplay — auditoria secção 294 ("roleplay por cenário:
// restaurante/hotel/aeroporto/reunião"). Mesmo mecanismo de query param que
// já existia para o setor do interviewer.
const ROLEPLAY_SCENARIOS = [
  { key: "restaurant", label: "Restaurante" },
  { key: "hotel", label: "Hotel" },
  { key: "airport", label: "Aeroporto" },
  { key: "meeting", label: "Reunião de trabalho" },
];

// Objetivos para a conversa livre — auditoria secção 294 ("conversa livre
// com objetivo"), para não ser sempre um "de que quer falar?" em aberto.
const CONVERSATION_GOALS = [
  { key: "small_talk", label: "Small talk" },
  { key: "weekend", label: "Contar o fim de semana" },
  { key: "opinion", label: "Dar uma opinião" },
  { key: "news", label: "Comentar uma notícia" },
];

// Progressão estruturada — auditoria secção 294 ("progressão estruturada
// · palavra → frase → diálogo → conversa"). As peças já existiam soltas
// (pronúncia/verbos, shadowing/ditado, roleplay, conversa livre) — isto só
// amarra-as num percurso visual explícito, sem lógica nova nem alterar
// nenhuma das rotas existentes por baixo. Puramente aditivo e apresentação.
const SPEAKING_PROGRESSION = [
  {
    stage: "1. Palavra",
    label: "Sons e pronúncia isolados",
    href: "/practice/pronunciation",
  },
  {
    stage: "2. Frase",
    label: "Ouvir e repetir (shadowing) ou ditado",
    href: "/practice/micro-challenges",
  },
  {
    stage: "3. Diálogo",
    label: "Roleplay guiado por cenário",
    href: "/speak/tutor?personality=roleplay",
  },
  {
    stage: "4. Conversa",
    label: "Conversa livre, sem guião",
    href: "/speak/tutor?personality=conversation_partner",
  },
];

// Personalidades do AI Tutor além de "coach" desbloqueadas a pedido do utilizador
// (2026-08-26) — ver src/lib/ai/personalities.ts e docs/decisions.md.
export default async function SpeakHubPage() {
  await requireUserWithProfile();

  const available = Object.entries(TUTOR_PERSONALITIES).filter(([, p]) => p.availableInMvp1);

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Speak</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Escolha com quem quer praticar hoje.
      </p>

      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-inkNeutral/50 dark:text-linen/50">
        Progressão sugerida
      </p>
      <div className="mb-8 grid grid-cols-2 gap-3">
        {SPEAKING_PROGRESSION.map((step) => (
          <Link key={step.stage} href={step.href}>
            <Card className="hover:border-verdigris">
              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">{step.stage}</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">{step.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-inkNeutral/50 dark:text-linen/50">
        Ou escolha diretamente
      </p>
      <div className="flex flex-col gap-3">
        {available.map(([key, persona]) => (
          <div key={key}>
            <Link href={`/speak/tutor?personality=${key}`}>
              <Card className="hover:border-verdigris">
                <p className="mb-1 font-display text-lg">{persona.label}</p>
                <p className="text-sm text-inkNeutral/70 dark:text-linen/70">{DESCRIPTIONS[key]}</p>
              </Card>
            </Link>
            {key === "interviewer" && (
              <div className="mt-2 flex flex-wrap gap-2 px-1">
                {INTERVIEW_SECTORS.map((sector) => (
                  <Link
                    key={sector.key}
                    href={`/speak/tutor?personality=interviewer&sector=${sector.key}`}
                    className="rounded-control border border-ink/10 px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:border-verdigris hover:text-verdigris dark:border-linen/10 dark:text-linen/60"
                  >
                    {sector.label}
                  </Link>
                ))}
              </div>
            )}
            {key === "roleplay" && (
              <div className="mt-2 flex flex-wrap gap-2 px-1">
                {ROLEPLAY_SCENARIOS.map((scenario) => (
                  <Link
                    key={scenario.key}
                    href={`/speak/tutor?personality=roleplay&scenario=${scenario.key}`}
                    className="rounded-control border border-ink/10 px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:border-verdigris hover:text-verdigris dark:border-linen/10 dark:text-linen/60"
                  >
                    {scenario.label}
                  </Link>
                ))}
              </div>
            )}
            {key === "conversation_partner" && (
              <div className="mt-2 flex flex-wrap gap-2 px-1">
                {CONVERSATION_GOALS.map((goal) => (
                  <Link
                    key={goal.key}
                    href={`/speak/tutor?personality=conversation_partner&goal=${goal.key}`}
                    className="rounded-control border border-ink/10 px-2 py-1 font-mono text-xs text-inkNeutral/60 hover:border-verdigris hover:text-verdigris dark:border-linen/10 dark:text-linen/60"
                  >
                    {goal.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
