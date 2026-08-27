import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ErrorCallout } from "@/components/ui/ErrorCallout";
import { getDueReviewCount } from "@/lib/srs/schedule";

// Fila de revisão espaçada real (SM-2) — src/lib/srs/. A lista de erros abaixo
// mostra todo o histórico não resolvido; /practice/review só mostra o que está
// vencido agora, no momento certo para consolidar a memória.
export default async function PracticePage() {
  const { user } = await requireUserWithProfile();

  const [errors, dueReviews] = await Promise.all([
    prisma.userError.findMany({
      where: { userId: user.id, resolvedAt: null },
      orderBy: { lastOccurredAt: "desc" },
      take: 20,
    }),
    getDueReviewCount(user.id),
  ]);

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Prática</h1>

      <Link href="/practice/topic" className="mb-3 block">
        <Card className="border-2 border-ink/10 hover:border-verdigris dark:border-linen/10">
          <p className="mb-1 font-display text-lg">O que quer trabalhar hoje?</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Vocabulário, gramática, listening, leitura ou tradução — à sua escolha
          </p>
        </Card>
      </Link>

      <Link href="/practice/review" className="mb-3 block">
        <Card className={dueReviews > 0 ? "border-clay hover:border-clay" : "hover:border-clay"}>
          <div className="flex items-center justify-between">
            <div>
              <p className="mb-1 font-mono text-xs uppercase tracking-wide text-clay">Revisão</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
                {dueReviews > 0 ? "Palavras e erros prontos a rever" : "Sem revisões pendentes agora"}
              </p>
            </div>
            {dueReviews > 0 && (
              <span className="rounded-full bg-clay px-3 py-1 font-mono text-sm font-semibold text-white">
                {dueReviews}
              </span>
            )}
          </div>
        </Card>
      </Link>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <Link href="/practice/daily-challenge">
          <Card className="hover:border-brass">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Desafio Diário</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Vocabulário, 2 min</p>
          </Card>
        </Link>
        <Link href="/practice/micro-challenges">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Micro-Desafios</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Momentos do dia</p>
          </Card>
        </Link>
      </div>

      <Link href="/practice/weekly-test" className="mb-3 block">
        <Card className="hover:border-brass">
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Diagnóstico Semanal</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Teste rápido por pilar — mostra o que corrigir esta semana
          </p>
        </Card>
      </Link>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <Link href="/practice/reading">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Leitura</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Textos com perguntas</p>
          </Card>
        </Link>
        <Link href="/practice/idioms">
          <Card className="hover:border-brass">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Idioma do Dia</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Phrasal verbs, expressões</p>
          </Card>
        </Link>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <Link href="/practice/verbs">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Verbos Irregulares</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Verbo do dia + tabela</p>
          </Card>
        </Link>
        <Link href="/practice/patterns">
          <Card className="hover:border-clay">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-clay">Construção Frásica</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">Ordem de palavras</p>
          </Card>
        </Link>
      </div>

      <Link href="/practice/culture" className="mb-3 block">
        <Card className="hover:border-brass">
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Cultura</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Small talk, registo, diferenças AmE/BrE
          </p>
        </Card>
      </Link>

      <Link href="/speak" className="mb-3 block">
        <Card className="hover:border-verdigris">
          <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Falar com o Tutor</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">
            Conversa livre, entrevista de emprego, ou o Coach de sempre
          </p>
        </Card>
      </Link>

      {errors.length === 0 ? (
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Ainda não há erros registados. Complete lições em Learn para começarmos a construir a sua base de
            revisão.
          </p>
        </Card>
      ) : (
        <div className="flex flex-col gap-3">
          {errors.map((error) => (
            <ErrorCallout key={error.id} label={`${error.pillar.toLowerCase()} · ${error.occurrences}x`}>
              {error.commonMistakePt ?? error.correction}
            </ErrorCallout>
          ))}
        </div>
      )}
    </main>
  );
}
