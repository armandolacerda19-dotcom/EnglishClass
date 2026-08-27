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

// Personalidades do AI Tutor além de "coach" desbloqueadas a pedido do utilizador
// (2026-08-26) — ver src/lib/ai/personalities.ts e docs/decisions.md.
export default async function SpeakHubPage() {
  await requireUserWithProfile();

  const available = Object.entries(TUTOR_PERSONALITIES).filter(([, p]) => p.availableInMvp1);

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Speak</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Escolha com quem quer praticar hoje.
      </p>
      <div className="flex flex-col gap-3">
        {available.map(([key, persona]) => (
          <Link key={key} href={`/speak/tutor?personality=${key}`}>
            <Card className="hover:border-verdigris">
              <p className="mb-1 font-display text-lg">{persona.label}</p>
              <p className="text-sm text-inkNeutral/70 dark:text-linen/70">{DESCRIPTIONS[key]}</p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
