import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { SkillOctagon } from "@/components/ui/SkillOctagon";
import { CefrLevelTag } from "@/components/ui/CefrLevelTag";
import { formatLevelCode } from "@/lib/level";
import { StampBadge } from "@/components/ui/StampBadge";
import { getCheckpointSummary } from "@/lib/checkpoints";

// Código curto para caber no carimbo circular (docs/09-sistema-design.md) — o título
// completo da conquista aparece por baixo do carimbo.
const ACHIEVEMENT_SHORT_CODE: Record<string, string> = {
  first_lesson_complete: "1ª",
  first_daily_challenge: "DIA",
  first_review: "REV",
  streak_3: "3d",
  streak_7: "7d",
  streak_30: "30d",
  first_weekly_test: "DIAG",
  first_reading_passage: "LER",
};

export default async function ProgressPage() {
  const { user, learningProfile } = await requireUserWithProfile();

  const [exerciseAttempts, resolvedErrors, achievements, checkpoints] = await Promise.all([
    prisma.exerciseAttempt.count({ where: { userId: user.id } }),
    prisma.userError.count({ where: { userId: user.id, resolvedAt: { not: null } } }),
    prisma.userAchievement.findMany({ where: { userId: user.id }, include: { achievement: true }, orderBy: { earnedAt: "desc" } }),
    getCheckpointSummary(user.id),
  ]);

  const skillProfile = {
    grammar: learningProfile.grammarScore,
    vocabulary: learningProfile.vocabularyScore,
    listening: learningProfile.listeningScore,
    speaking: learningProfile.speakingScore,
    pronunciation: learningProfile.pronunciationScore,
    reading: learningProfile.readingScore,
    writing: learningProfile.writingScore,
    translation: learningProfile.translationScore,
  };

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <div className="mb-6 flex items-center gap-3">
        <h1 className="font-display text-2xl">O seu progresso</h1>
        <CefrLevelTag code={formatLevelCode(learningProfile)} />
      </div>

      <Card className="mb-4 flex justify-center">
        <SkillOctagon scores={skillProfile} />
      </Card>

      <Card className="mb-4">
        <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Checkpoints</p>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <p className="font-mono text-xl">{checkpoints.doneToday ? "✓" : "—"}</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">hoje</p>
          </div>
          <div>
            <p className="font-mono text-xl">{checkpoints.daysThisWeek}/7</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">esta semana</p>
          </div>
          <div>
            <p className="font-mono text-xl">{checkpoints.daysThisMonth}/30</p>
            <p className="text-xs text-inkNeutral/60 dark:text-linen/60">este mês</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <p className="font-mono text-2xl">{exerciseAttempts}</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">exercícios tentados</p>
        </Card>
        <Card>
          <p className="font-mono text-2xl">{resolvedErrors}</p>
          <p className="text-xs text-inkNeutral/60 dark:text-linen/60">erros já corrigidos</p>
        </Card>
      </div>

      {achievements.length > 0 && (
        <Card className="mt-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-brass">Conquistas</p>
          <div className="flex flex-wrap gap-4">
            {achievements.map((a) => (
              <div key={a.id} className="flex flex-col items-center gap-1">
                <StampBadge code={ACHIEVEMENT_SHORT_CODE[a.achievement.code] ?? "★"} tone="brass" />
                <p className="max-w-16 text-center text-xs text-inkNeutral/60 dark:text-linen/60">{a.achievement.title}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </main>
  );
}
