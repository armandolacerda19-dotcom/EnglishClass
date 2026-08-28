import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { SPEAKING_CHALLENGE_ITEMS } from "@/content/speakingChallenges";
import { Card } from "@/components/ui/Card";

const TIER_LABEL: Record<string, string> = {
  beginner: "Iniciante",
  intermediate: "Intermédio",
  advanced: "Avançado",
};

// Desafio de Discurso Livre — tipo de exercício novo (Exercise Engine,
// achado crítico da auditoria de 2026-08-28). Hub simples, mesmo padrão de
// writing-challenge/page.tsx: escolher um tema por nível antes de falar.
export default async function SpeakingChallengePage() {
  await requireUserWithProfile();

  const byTier = SPEAKING_CHALLENGE_ITEMS.reduce<Record<string, typeof SPEAKING_CHALLENGE_ITEMS>>((acc, item) => {
    (acc[item.tier] ??= []).push(item);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Desafio de Discurso Livre</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Escolha um tema e fale livremente, sem guião — grave-se a explicar as suas ideias, não a ler nem a repetir.
      </p>

      {(["beginner", "intermediate", "advanced"] as const).map((tier) => (
        <div key={tier} className="mb-6">
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-inkNeutral/50 dark:text-linen/50">{TIER_LABEL[tier]}</p>
          <div className="flex flex-col gap-2">
            {(byTier[tier] ?? []).map((item) => (
              <Link key={item.id} href={`/practice/speaking-challenge/${item.id}`}>
                <Card className="hover:border-verdigris">
                  <p className="text-sm">{item.prompt}</p>
                  <p className="mt-1 text-xs text-inkNeutral/60 dark:text-linen/60">{item.promptPt}</p>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
