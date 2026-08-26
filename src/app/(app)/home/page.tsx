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

export default async function HomePage() {
  const { user, learningProfile } = await requireUserWithProfile();

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
      />
    );
  }

  const nextLesson = await getNextLessonForUser(user.id);

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Olá, {user.name.split(" ")[0]}.</p>
      <div className="mb-6 mt-1 flex items-center gap-3">
        <h1 className="font-display text-2xl">O que vamos praticar hoje?</h1>
        <CefrLevelTag code={formatLevelCode(learningProfile)} />
      </div>

      <StreakXp xp={learningProfile.xp} streak={learningProfile.currentStreak} />

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
              <li key={area}>{area.toLowerCase()}</li>
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
}: {
  levelCode: string;
  plan: { currentDay: number; totalDays: number; weeklyThemesJson: unknown } | null;
  name: string;
  weakAreas: string[];
  xp: number;
  streak: number;
}) {
  const currentDay = plan?.currentDay ?? 1;
  const totalDays = plan?.totalDays ?? 1;

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <p className="text-sm text-inkNeutral/70 dark:text-linen/70">Olá, {name.split(" ")[0]}.</p>
      <div className="mb-6 mt-1 flex items-center gap-3">
        <h1 className="font-display text-2xl">
          Day {currentDay}/{totalDays}
        </h1>
        <CefrLevelTag code={code} />
      </div>

      <StreakXp xp={xp} streak={streak} />

      <Card className="mb-4">
        <ProgressBar value={(currentDay / totalDays) * 100} label="Progresso do plano intensivo" />
      </Card>

      {weakAreas.length > 0 && (
        <Card>
          <p className="mb-2 font-mono text-xs uppercase tracking-wide text-clay">Prioridade de hoje</p>
          <p className="text-sm">{weakAreas[0]?.toLowerCase()}</p>
        </Card>
      )}
    </main>
  );
}
