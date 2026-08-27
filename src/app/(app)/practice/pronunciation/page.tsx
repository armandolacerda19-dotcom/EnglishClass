import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { PRONUNCIATION_TIPS } from "@/content/pronunciationTips";

// Feedback fonético PT→EN — auditoria secção 294. Ver src/content/pronunciationTips.ts.
export default async function PronunciationPage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Sons e Pronúncia</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Os padrões mais comuns em que o português influencia a pronúncia do inglês.
      </p>
      <div className="flex flex-col gap-4">
        {PRONUNCIATION_TIPS.map((tip) => (
          <Card key={tip.id}>
            <p className="mb-2 font-display text-lg">{tip.title}</p>
            <p className="mb-3 text-sm text-inkNeutral/80 dark:text-linen/80">{tip.explanationPt}</p>
            <div className="mb-3 flex flex-wrap gap-2">
              {tip.examples.map((example) => (
                <span
                  key={example}
                  className="rounded-control border border-ink/10 px-3 py-1.5 text-sm dark:border-linen/10"
                >
                  {example}
                </span>
              ))}
            </div>
            <PlayTranscript text={tip.examples.join(". ")} />
          </Card>
        ))}
      </div>
    </main>
  );
}
