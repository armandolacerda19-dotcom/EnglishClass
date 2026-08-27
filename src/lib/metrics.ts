import { prisma } from "@/lib/prisma";

// Métricas de retenção/atividade — Fase 5 da auditoria ("Personalização"),
// item "métricas" (secção 27/29 de docs/AUDITORIA-2026-08-26.md). Sem
// dashboard novo nem tabela nova: agrega dados que já existem em 4 tabelas
// de tentativas + a fila de revisão SRS, só nunca tinham sido mostrados ao
// utilizador de forma agregada ao longo do tempo.

export interface DailyActivity {
  date: string; // YYYY-MM-DD
  count: number;
}

function dateKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

// Últimos 7 dias (incluindo hoje), contagem de "ações de prática" por dia —
// soma de exercícios de lição, tentativas de speaking/writing e traduções.
// Não inclui Desafio Diário/micro-desafios/revisões (não têm uma tabela de
// tentativas própria com timestamp) — é um proxy de atividade, não uma
// contagem exaustiva de tudo o que o utilizador fez.
export async function getWeeklyActivity(userId: string): Promise<DailyActivity[]> {
  const since = new Date();
  since.setUTCDate(since.getUTCDate() - 6);
  since.setUTCHours(0, 0, 0, 0);

  const [exercises, speaking, writing, translations] = await Promise.all([
    prisma.exerciseAttempt.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.speakingAttempt.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.writingAttempt.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.translation.findMany({ where: { userId, createdAt: { gte: since } }, select: { createdAt: true } }),
  ]);

  const counts = new Map<string, number>();
  for (const row of [...exercises, ...speaking, ...writing, ...translations]) {
    const key = dateKey(row.createdAt);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const days: DailyActivity[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(since);
    d.setUTCDate(since.getUTCDate() + (6 - i));
    const key = dateKey(d);
    days.push({ date: key, count: counts.get(key) ?? 0 });
  }
  return days;
}

export interface RetentionSnapshot {
  totalItems: number;
  dueToday: number;
  mastered: number; // repetitions >= 5, aproximação razoável de "já sabe bem"
  averageEase: number | null; // 1.3-2.5+ (escala SM-2), null se não houver itens
}

export async function getRetentionSnapshot(userId: string): Promise<RetentionSnapshot> {
  const items = await prisma.reviewScheduleItem.findMany({
    where: { userId },
    select: { repetitions: true, easeFactor: true, dueAt: true },
  });

  if (items.length === 0) {
    return { totalItems: 0, dueToday: 0, mastered: 0, averageEase: null };
  }

  const now = new Date();
  const dueToday = items.filter((i) => i.dueAt <= now).length;
  const mastered = items.filter((i) => i.repetitions >= 5).length;
  const averageEase = items.reduce((sum, i) => sum + i.easeFactor, 0) / items.length;

  return { totalItems: items.length, dueToday, mastered, averageEase };
}
