import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { SkillOctagon } from "@/components/ui/SkillOctagon";
import { CefrLevelTag } from "@/components/ui/CefrLevelTag";
import { formatLevelCode } from "@/lib/level";

export default async function ProgressPage() {
  const { user, learningProfile } = await requireUserWithProfile();

  const [exerciseAttempts, resolvedErrors] = await Promise.all([
    prisma.exerciseAttempt.count({ where: { userId: user.id } }),
    prisma.userError.count({ where: { userId: user.id, resolvedAt: { not: null } } }),
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
    </main>
  );
}
