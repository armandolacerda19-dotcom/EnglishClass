import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CefrLevelTag } from "@/components/ui/CefrLevelTag";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatLevelCode } from "@/lib/level";
import { StreakXp } from "@/components/ui/StreakXp";
import { getNextLessonForUser } from "@/lib/lessons";
import { getDueReviewCount } from "@/lib/srs/schedule";
import { PILLAR_LABEL } from "@/lib/pillarDisplay";
import { generateDailyPlan } from "@/lib/plan/dailyPlan";

export default async function HomePage() {
  const { user, learningProfile } = await requireUserWithProfile();
  const dueReviews = await getDueReviewCount(user.id);

  if (learningProfile.track === "INTENSIVE") {
    const intensivePlan = await prisma.intensivePlan.findUnique({ where: { userId: user.id } });
    return (
      <IntensiveHome
        levelCode={formatLevelCode(learningProfile)}
        plan={intensivePlan}
        name={user.name}
        weakAreas={learningProfile.weakAreas}
        xp={learningProfile.xp}
        streak={learningProfile.currentStreak}
        streakFreezes={learningProfile.streakFreezes}
        dueReviews={dueReviews}
        dailyMinutesTarget={learningProfile.dailyMinutesTarget}
      />
    );
  }

  const nextLesson = await getNextLessonForUser(user.id);
  // Gerado em api/placement/submit (generateStandardPlan) e nunca lido em
  // lado nenhum antes desta correção — o "plano personalizado" prometido no
  // onboarding não tinha efeito visível nenhum para utilizadores do plano
  // Standard. Ver docs/decisions.md 2026-08-26 (auditoria).
  const learningPlan = await prisma.learningPlan.findUnique({ where: { userId: user.id } });
  const planNote = (learningPlan?.planJson as { note?: string } | null)?.note;
  // "Inglês de hoje" — secção 47 da auditoria: uma lista concreta de atividades
  // e minutos, não só uma frase genérica sobre o ritmo. Ver src/lib/plan/dailyPlan.ts.
  const dailyPlan = generateDailyPlan(learningProfile.dailyMinutesTarget, dueReviews > 0, learningProfile.weakAreas);

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Olá, {user.name.split(" ")[0]}.</p>
      <div className="mb-6 mt-1 flex items-center gap-3">
        <h1 className="font-display text-2xl">O que vamos praticar hoje?</h1>
        <CefrLevelTag code={formatLevelCode(learningProfile)} />
      </div>

      <StreakXp xp={learningProfile.xp} streak={learningProfile.currentStreak} streakFreezes={learningProfile.streakFreezes} />

      <Card className="mb-3 border-verdigris/30">
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">
          Inglês de hoje · {learningProfile.dailyMinutesTarget} min
        </p>
        {planNote && <p className="mb-3 text-xs text-inkNeutral/60 dark:text-linen/60">{planNote}</p>}
        <ul className="flex flex-col gap-2">
          {dailyPlan.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-control border border-ink/10 p-2 text-sm hover:border-verdigris dark:border-linen/10"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-inkNeutral/60 dark:text-linen/60">{item.minutes} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      <Link href="/practice/topic" className="mb-3 block">
        <Card className="border-2 border-ink/10 hover:border-verdigris dark:border-linen/10">
          <p className="mb-1 font-display text-lg">Escolher tema de hoje</p>
          <p className="text-xs text-inkNeutral/70 dark:text-linen/70">
            Vocabulário, gramática, listening, leitura ou tradução
          </p>
        </Card>
      </Link>

      {dueReviews > 0 && (
        <Link href="/practice/review" className="mb-3 block">
          <Card className="border-clay hover:border-clay">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-clay">Revisão pendente</p>
                <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Não deixe esquecer o que já aprendeu</p>
              </div>
              <span className="rounded-full bg-clay px-3 py-1 font-mono text-sm font-semibold text-white">
                {dueReviews}
              </span>
            </div>
          </Card>
        </Link>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/practice/daily-challenge">
          <Card className="hover:border-brass">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Desafio Diário</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Vocabulário, 2 min</p>
          </Card>
        </Link>
        <Link href="/practice/micro-challenges">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Micro-Desafios</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Momentos do dia</p>
          </Card>
        </Link>
        <Link href="/practice/weekly-test">
          <Card className="hover:border-brass">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Diagnóstico Semanal</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">O que corrigir esta semana</p>
          </Card>
        </Link>
        <Link href="/speak">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Falar com o Tutor</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Coach, entrevista, conversa livre</p>
          </Card>
        </Link>
      </div>

      <Card className="mb-4">
        <p className="mb-2 font-mono text-xs uppercase tracking-wide text-verdigris">Continuar</p>
        <p className="mb-4 font-display text-lg">{nextLesson?.title ?? "Sem lições disponíveis de momento"}</p>
        {nextLesson && (
          <Link href={`/learn/lesson/${nextLesson.id}`}>
            <Button>Continuar lição</Button>
          </Link>
        )}
      </Card>

      {learningProfile.weakAreas.length > 0 && (
        <Card>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-clay">Áreas a reforçar</p>
          <ul className="list-inside list-disc text-sm">
            {learningProfile.weakAreas.map((area) => (
              <li key={area}>{PILLAR_LABEL[area] ?? area.toLowerCase()}</li>
            ))}
          </ul>
        </Card>
      )}
    </main>
  );
}

function IntensiveHome({
  levelCode: code,
  plan,
  name,
  weakAreas,
  xp,
  streak,
  streakFreezes,
  dueReviews,
  dailyMinutesTarget,
}: {
  levelCode: string;
  plan: { startDate: Date; totalDays: number; weeklyThemesJson: unknown } | null;
  name: string;
  weakAreas: string[];
  xp: number;
  streak: number;
  streakFreezes: number;
  dueReviews: number;
  dailyMinutesTarget: number;
}) {
  const dailyPlan = generateDailyPlan(dailyMinutesTarget, dueReviews > 0, weakAreas);
  // `currentDay` nunca era incrementado em lado nenhum — ficava preso em "Day 1"
  // para sempre. Em vez de tentar manter um contador (exigiria um job agendado,
  // que a app não tem), calcula-se o dia a partir de `startDate`: dias de
  // calendário decorridos, não dias de uso — o que é como o plano é descrito ao
  // utilizador ("dia X de Y do plano"), não um contador de sessões. Ver
  // docs/decisions.md, auditoria 2026-08-26.
  const totalDays = plan?.totalDays ?? 30;
  const elapsedDays = plan
    ? Math.floor((Date.now() - plan.startDate.getTime()) / 86_400_000) + 1
    : 1;
  const currentDay = Math.min(totalDays, Math.max(1, elapsedDays));

  const weeklyThemes = Array.isArray((plan?.weeklyThemesJson as any)?.weeks)
    ? ((plan!.weeklyThemesJson as any).weeks as { week: number; focus: string }[])
    : [];
  const currentWeek = Math.max(1, Math.ceil(currentDay / 7));
  const weekFocus = weeklyThemes.find((w) => w.week === currentWeek)?.focus;

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Olá, {name.split(" ")[0]}.</p>
      <div className="mb-6 mt-1 flex items-center gap-3">
        <h1 className="font-display text-2xl">
          Dia {currentDay}/{totalDays}
        </h1>
        <CefrLevelTag code={code} />
      </div>

      <StreakXp xp={xp} streak={streak} streakFreezes={streakFreezes} />

      <Card className="mb-3 border-verdigris/30">
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">
          Inglês de hoje · {dailyMinutesTarget} min
        </p>
        <ul className="flex flex-col gap-2">
          {dailyPlan.map((item) => (
            <li key={item.href + item.label}>
              <Link
                href={item.href}
                className="flex items-center justify-between rounded-control border border-ink/10 p-2 text-sm hover:border-verdigris dark:border-linen/10"
              >
                <span>{item.label}</span>
                <span className="font-mono text-xs text-inkNeutral/60 dark:text-linen/60">{item.minutes} min</span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>

      {dueReviews > 0 && (
        <Link href="/practice/review" className="mb-3 block">
          <Card className="border-clay hover:border-clay">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 font-mono text-xs uppercase tracking-wide text-clay">Revisão pendente</p>
                <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Não deixe esquecer o que já aprendeu</p>
              </div>
              <span className="rounded-full bg-clay px-3 py-1 font-mono text-sm font-semibold text-white">
                {dueReviews}
              </span>
            </div>
          </Card>
        </Link>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/practice/daily-challenge">
          <Card className="hover:border-brass">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Desafio Diário</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Vocabulário, 2 min</p>
          </Card>
        </Link>
        <Link href="/practice/micro-challenges">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Micro-Desafios</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Momentos do dia</p>
          </Card>
        </Link>
        <Link href="/practice/weekly-test">
          <Card className="hover:border-brass">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">Diagnóstico Semanal</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">O que corrigir esta semana</p>
          </Card>
        </Link>
        <Link href="/speak">
          <Card className="hover:border-verdigris">
            <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">Falar com o Tutor</p>
            <p className="text-xs text-inkNeutral/70 dark:text-linen/70">Coach, entrevista, conversa livre</p>
          </Card>
        </Link>
      </div>

      <Card className="mb-4">
        <ProgressBar value={(currentDay / totalDays) * 100} label="Progresso do plano intensivo" />
        {weekFocus && (
          <p className="mt-3 text-sm text-inkNeutral/70 dark:text-linen/70">
            Foco desta semana: {weekFocus}
          </p>
        )}
      </Card>

      {weakAreas.length > 0 && (
        <Card>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-clay">Prioridade de hoje</p>
          <p className="text-sm">{weakAreas[0] ? PILLAR_LABEL[weakAreas[0]] ?? weakAreas[0].toLowerCase() : ""}</p>
        </Card>
      )}
    </main>
  );
}
