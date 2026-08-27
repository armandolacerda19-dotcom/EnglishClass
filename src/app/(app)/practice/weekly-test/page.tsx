import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { getWeeklyTest } from "@/lib/weeklyTest";
import { WeeklyTestRunner } from "@/components/challenge/WeeklyTestRunner";
import { Card } from "@/components/ui/Card";

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

// Diagnóstico Semanal — 1x por semana, para não competir com o Desafio Diário.
export default async function WeeklyTestPage() {
  const { user } = await requireUserWithProfile();

  const recent = await prisma.assessmentResult.findFirst({
    where: { userId: user.id, type: "WEEKLY", createdAt: { gte: daysAgo(6) } },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    const scoreJson = recent.scoreJson as any;
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Diagnóstico Semanal</h1>
        <Card>
          <p className="mb-2 text-sm text-inkNeutral/70 dark:text-linen/70">
            Já fez o diagnóstico desta semana — voltará a estar disponível daqui a alguns dias.
          </p>
          <p className="font-mono text-2xl">{scoreJson?.overallScore ?? 0}%</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">último resultado</p>
        </Card>
      </main>
    );
  }

  const questions = await getWeeklyTest(new Date(), user.id);

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Diagnóstico Semanal</h1>
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Ainda não há exercícios suficientes para gerar o diagnóstico. Complete algumas lições em Learn primeiro.
          </p>
        </Card>
      </main>
    );
  }

  return <WeeklyTestRunner questions={questions} />;
}
