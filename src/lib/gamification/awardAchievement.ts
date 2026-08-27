import { prisma } from "@/lib/prisma";

// Upsert idempotente — pode ser chamado sempre que a condição é verdadeira
// (ex. a cada dia de streak) sem criar duplicados nem re-notificar.
export async function awardAchievement(userId: string, code: string) {
  const achievement = await prisma.achievement.findUnique({ where: { code } });
  if (!achievement) return;

  await prisma.userAchievement.upsert({
    where: { userId_achievementId: { userId, achievementId: achievement.id } },
    update: {},
    create: { userId, achievementId: achievement.id },
  });
}
