import Link from "next/link";
import { requireUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { CefrLevelTag } from "@/components/ui/CefrLevelTag";
import { SkillOctagon } from "@/components/ui/SkillOctagon";
import { Button } from "@/components/ui/Button";
import { formatLevelCode } from "@/lib/level";

export default async function OnboardingResultsPage() {
  const user = await requireUser();

  const [profile, latestTest] = await Promise.all([
    prisma.learningProfile.findUniqueOrThrow({ where: { userId: user.id } }),
    prisma.placementTest.findFirst({ where: { userId: user.id }, orderBy: { completedAt: "desc" } }),
  ]);

  const skillProfile = (latestTest?.skillProfileJson as Record<string, number>) ?? {};

  return (
    <main className="mx-auto flex max-w-lg flex-col items-center gap-6 px-6 py-16 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-verdigris">Resultado do placement test</p>
      <CefrLevelTag code={formatLevelCode(profile)} />
      <h1 className="font-display text-2xl">O seu ponto de partida está definido.</h1>

      <SkillOctagon scores={skillProfile} />

      {profile.weakAreas.length > 0 && (
        <p className="text-sm text-inkNeutral/80 dark:text-linen/80">
          Vamos dar prioridade a: {profile.weakAreas.map((a) => a.toLowerCase()).join(", ")}.
        </p>
      )}

      <Link href="/home">
        <Button>Ir para a Home</Button>
      </Link>
    </main>
  );
}
