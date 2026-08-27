import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { SENTENCE_PATTERNS } from "@/content/sentencePatterns";

// Construção frásica — pedido explícito do utilizador (2026-08-26). Padrões de
// ordem de palavras que persistem muito depois de a gramática "estar
// aprendida", porque raramente são ensinados como tópico próprio.
export default async function PatternsPage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Construção Frásica</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Padrões de ordem de palavras que continuam a confundir muito depois de a gramática estar aprendida.
      </p>
      <div className="flex flex-col gap-4">
        {SENTENCE_PATTERNS.map((p) => (
          <Card key={p.id}>
            <p className="mb-2 font-display text-lg">{p.title}</p>
            <p className="mb-3 text-sm text-inkNeutral/80 dark:text-linen/80">{p.rule}</p>
            <div className="mb-2 rounded-card bg-clay/5 p-3">
              <p className="text-xs text-clay">✕ {p.wrong}</p>
            </div>
            <div className="mb-3 rounded-card bg-verdigris/5 p-3">
              <p className="text-xs text-verdigris">✓ {p.right}</p>
            </div>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">{p.explanation}</p>
          </Card>
        ))}
      </div>
    </main>
  );
}
