import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";
import { PILLAR_LABEL, PILLAR_ACCENT } from "@/lib/pillarDisplay";

const SHEETS: { pillar: string; title: string; description: string }[] = [
  { pillar: "VOCABULARY", title: "Vocabulário", description: "Palavras e expressões novas" },
  { pillar: "GRAMMAR", title: "Gramática", description: "Regras e erros comuns PT→EN" },
  { pillar: "LISTENING", title: "Listening", description: "Compreensão oral" },
  { pillar: "READING", title: "Leitura", description: "Compreensão de texto" },
  { pillar: "TRANSLATION", title: "Tradução", description: "PT→EN, resposta livre" },
];

// "Sheets" de tema — pedido do utilizador (2026-08-26): "deve ter várias sheets, que
// possa escolher o que quero trabalhar hoje, vocabulário, gramática entre outras".
// Ao contrário do Diagnóstico Semanal (1x por semana, todos os pilares), aqui o
// utilizador escolhe um único pilar e pratica quantas vezes quiser, com perguntas
// novas de cada vez (src/lib/practiceQuestions.ts).
export default async function TopicHubPage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">O que quer praticar hoje?</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Escolha um tema — cada sessão traz perguntas novas.
      </p>
      <div className="flex flex-col gap-3">
        {SHEETS.map((sheet) => {
          const accent = PILLAR_ACCENT[sheet.pillar]!;
          return (
            <Link key={sheet.pillar} href={`/practice/topic/${sheet.pillar.toLowerCase()}`}>
              <Card className={accent.hoverBorder}>
                <p className={`mb-1 font-mono text-xs uppercase tracking-wide ${accent.text}`}>{sheet.title}</p>
                <p className="text-sm text-inkNeutral/70 dark:text-linen/70">{sheet.description}</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
