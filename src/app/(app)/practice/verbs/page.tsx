import { requireUserWithProfile } from "@/lib/session";
import { getVerbOfTheDay, IRREGULAR_VERBS } from "@/content/irregularVerbs";
import { VerbRunner } from "@/components/challenge/VerbRunner";
import { Card } from "@/components/ui/Card";

// Verbos irregulares — pedido explícito do utilizador (2026-08-26): "deve
// investir em conteúdo de gramática, verbos". Verbo do dia (recall + auto-
// avaliação) + tabela de referência completa sempre visível.
export default async function VerbsPage() {
  await requireUserWithProfile();
  const verb = getVerbOfTheDay();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Verbos Irregulares</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Um verbo por dia para memorizar, e a tabela completa para consultar sempre que precisar.
      </p>

      <VerbRunner verb={verb} />

      <Card className="mt-6">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Tabela de referência</p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-ink/10 dark:border-linen/10">
                <th className="py-1 pr-2 font-mono text-xs uppercase text-inkNeutral/60 dark:text-linen/60">Base</th>
                <th className="py-1 pr-2 font-mono text-xs uppercase text-inkNeutral/60 dark:text-linen/60">Past Simple</th>
                <th className="py-1 pr-2 font-mono text-xs uppercase text-inkNeutral/60 dark:text-linen/60">Participle</th>
                <th className="py-1 font-mono text-xs uppercase text-inkNeutral/60 dark:text-linen/60">PT</th>
              </tr>
            </thead>
            <tbody>
              {IRREGULAR_VERBS.map((v) => (
                <tr key={v.base} className="border-b border-ink/5 dark:border-linen/5">
                  <td className="py-1.5 pr-2 font-semibold">{v.base}</td>
                  <td className="py-1.5 pr-2">{v.pastSimple}</td>
                  <td className="py-1.5 pr-2">{v.pastParticiple}</td>
                  <td className="py-1.5 text-inkNeutral/70 dark:text-linen/70">{v.translationPt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </main>
  );
}
