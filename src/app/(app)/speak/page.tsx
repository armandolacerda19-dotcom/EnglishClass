import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { TUTOR_PERSONALITIES } from "@/lib/ai/personalities";

const DESCRIPTIONS: Record<string, string> = {
  coach: "Feedback direto com memória dos seus erros recorrentes — o ponto de partida.",
  conversation_partner: "Conversa livre e casual, ao ritmo de um diálogo real.",
  interviewer: "Simula uma entrevista de emprego em inglês — pergunta a pergunta, como na vida real.",
  native_friend: "Conversa informal, cheia de expressões idiomáticas explicadas ao longo do caminho.",
};

// Setores para a entrevista — item #14 da lista de melhorias (inglês
// profissional por setor). Continua genérico se nenhum for escolhido.
const INTERVIEW_SECTORS = [
  { key: "tech", label: "Tecnologia" },
  { key: "healthcare", label: "Saúde" },
  { key: "sales", label: "Vendas / Negócios" },
  { key: "hospitality", label: "Hotelaria / Turismo" },
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
          </div>
        ))}
      </div>
    </main>
  );
}
