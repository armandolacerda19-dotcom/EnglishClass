import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { CULTURAL_TIPS } from "@/content/culturalTips";

const CATEGORY_LABEL: Record<string, string> = {
  small_talk: "small talk",
  register: "registo",
  variants: "AmE / BrE",
  etiquette: "etiqueta",
};

// Cultura e pragmática — item #9 da lista de melhorias. Complementa a gramática:
// registo, small talk, diferenças AmE/BrE — o que faz soar natural, não só correto.
export default async function CulturePage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Cultura</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Pequenas dicas para soar mais natural, além da gramática.
      </p>
      <div className="flex flex-col gap-4">
        {CULTURAL_TIPS.map((tip) => (
          <Card key={tip.id}>
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">{CATEGORY_LABEL[tip.category]}</p>
            <p className="mb-2 font-display text-lg">{tip.title}</p>
            <p className="mb-3 text-sm text-inkNeutral/80 dark:text-linen/80">{tip.body}</p>
            {tip.example && (
              <div className="rounded-card bg-verdigris/5 p-3">
                <p className="mb-1 text-xs text-inkNeutral/60 dark:text-linen/60">{tip.example.situation}</p>
                <p className="text-sm italic">{tip.example.text}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </main>
  );
}
