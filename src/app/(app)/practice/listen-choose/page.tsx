import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { TIER_LABEL } from "@/lib/listenChoose";

const TIER_DESCRIPTION: Record<string, string> = {
  beginner: "Frases curtas, áudio lento e claro por omissão.",
  intermediate: "Frases completas, velocidade natural.",
  advanced: "Mini-diálogos, contexto mais complexo, velocidade natural.",
};

// Ouvir e Escolher — tipo de exercício novo (Exercise Engine, 2026-08-28).
// Progressão formal por camada, pedida explicitamente.
export default async function ListenChoosePage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Ouvir e Escolher</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">Escolha o nível de dificuldade.</p>

      <div className="flex flex-col gap-2">
        {(["beginner", "intermediate", "advanced"] as const).map((tier) => (
          <Link key={tier} href={`/practice/listen-choose/${tier}`}>
            <Card className="hover:border-verdigris">
              <p className="text-sm font-semibold">{TIER_LABEL[tier]}</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">{TIER_DESCRIPTION[tier]}</p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
