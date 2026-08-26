import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { ErrorCallout } from "@/components/ui/ErrorCallout";

// MVP1: lista de erros recorrentes por pilar, sem fila de repetição espaçada completa
// (algoritmo SM-2 completo fica para MVP2 — docs/10-scope-mvp1.md).
export default async function PracticePage() {
  const { user } = await requireUserWithProfile();

  const errors = await prisma.userError.findMany({
    where: { userId: user.id, resolvedAt: null },
    orderBy: { lastOccurredAt: "desc" },
    take: 20,
  });

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-6 font-display text-2xl">Prática</h1>

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
