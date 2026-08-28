import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { PRONUNCIATION_TIPS } from "@/content/pronunciationTips";

// Feedback fonético PT→EN — auditoria secção 294. Ver src/content/pronunciationTips.ts.
export default async function PronunciationPage() {
  await requireUserWithProfile();

  // Fase 13 (2026-08-27) — os itens de "fala ligada" (connected speech) são
  // conceptualmente diferentes dos de som isolado: não são sobre pronunciar
  // um fonema difícil, são sobre como palavras inteiras se ligam/reduzem na
  // fala corrida. Agrupados em 2 secções para deixar essa diferença clara,
  // em vez de misturar tudo numa lista só.
  const soundTips = PRONUNCIATION_TIPS.filter((t) => t.category !== "connected-speech");
  const connectedSpeechTips = PRONUNCIATION_TIPS.filter((t) => t.category === "connected-speech");

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Sons e Pronúncia</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Os padrões mais comuns em que o português influencia a pronúncia do inglês.
      </p>

      <p className="mb-3 font-mono text-xs uppercase tracking-widest text-verdigris">Sons individuais</p>
      <div className="mb-8 flex flex-col gap-4">
        {soundTips.map((tip) => (
          <PronunciationTipCard key={tip.id} tip={tip} />
        ))}
      </div>

      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">Fala ligada (connected speech)</p>
      <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">
        Como as palavras se ligam e reduzem na fala real, mais rápida do que frases isoladas — o que mais separa
        "entender devagar" de "acompanhar um filme ou uma conversa a sério".
      </p>
      <div className="flex flex-col gap-4">
        {connectedSpeechTips.map((tip) => (
          <PronunciationTipCard key={tip.id} tip={tip} />
        ))}
      </div>
    </main>
  );
}

function PronunciationTipCard({ tip }: { tip: (typeof PRONUNCIATION_TIPS)[number] }) {
  return (
    <Card>
      <p className="mb-2 font-display text-lg">{tip.title}</p>
      <p className="mb-3 text-sm text-inkNeutral/80 dark:text-linen/80">{tip.explanationPt}</p>
      <div className="mb-3 flex flex-wrap gap-2">
        {tip.examples.map((example) => (
          <span key={example} className="rounded-control border border-ink/10 px-3 py-1.5 text-sm dark:border-linen/10">
            {example}
          </span>
        ))}
      </div>
      <PlayTranscript text={tip.examples.join(". ")} />
    </Card>
  );
}
