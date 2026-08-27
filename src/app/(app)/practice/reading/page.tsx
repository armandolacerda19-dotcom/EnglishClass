import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { READING_PASSAGES } from "@/content/readingPassages";

// Leitura extensiva — texto conectado, não frases isoladas. Ver docs/decisions.md
// 2026-08-26 (item de alto impacto na crítica de produto).
export default async function ReadingHubPage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Leitura</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Textos curtos para ler em inglês, com perguntas de compreensão.
      </p>
      <div className="flex flex-col gap-3">
        {READING_PASSAGES.map((passage) => (
          <Link key={passage.id} href={`/practice/reading/${passage.id}`}>
            <Card className="hover:border-verdigris">
              <div className="flex items-center justify-between">
                <p className="font-display text-lg">{passage.title}</p>
                <span className="font-mono text-xs text-verdigris">{passage.level}</span>
              </div>
              <p className="mt-1 text-xs text-inkNeutral/60 dark:text-linen/60">
                {passage.questions.length} perguntas de compreensão
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
