import { prisma } from "@/lib/prisma";

// Checkpoints diário/semanal/mensal (secção 5 do master prompt, docs/05-avaliacao-certificacao.md)
// — MVP1 usa a conclusão do Desafio Diário como proxy do checkpoint diário.

function daysAgo(n: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - n);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export interface CheckpointSummary {
  doneToday: boolean;
  daysThisWeek: number; // últimos 7 dias, incl. hoje
  daysThisMonth: number; // últimos 30 dias, incl. hoje
}

export async function getCheckpointSummary(userId: string): Promise<CheckpointSummary> {
  const [today, week, month] = await Promise.all([
    prisma.assessmentResult.count({ where: { userId, type: "DAILY", createdAt: { gte: daysAgo(0) } } }),
    prisma.assessmentResult.count({ where: { userId, type: "DAILY", createdAt: { gte: daysAgo(6) } } }),
    prisma.assessmentResult.count({ where: { userId, type: "DAILY", createdAt: { gte: daysAgo(29) } } }),
  ]);

  return { doneToday: today > 0, daysThisWeek: week, daysThisMonth: month };
}
