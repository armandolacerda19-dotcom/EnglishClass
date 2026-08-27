import { prisma } from "@/lib/prisma";
import { awardAchievement } from "./awardAchievement";

const STREAK_ACHIEVEMENTS: Record<number, string> = {
  3: "streak_3",
  7: "streak_7",
  30: "streak_30",
};

const XP = {
  EXERCISE_CORRECT: 10,
  EXERCISE_INCORRECT: 2,
  WRITING: 15,
  SPEAKING: 15,
  TRANSLATION: 10,
  LESSON_COMPLETE: 30,
  DAILY_CHALLENGE: 20,
  MICRO_CHALLENGE: 8,
  REVIEW: 5,
  WEEKLY_TEST: 40,
  TUTOR_MESSAGE: 3,
} as const;

export type ActivityKind = keyof typeof XP;

function isSameDay(a: Date, b: Date) {
  return a.getUTCFullYear() === b.getUTCFullYear() && a.getUTCMonth() === b.getUTCMonth() && a.getUTCDate() === b.getUTCDate();
}

function isNextDay(previous: Date, now: Date) {
  const next = new Date(previous);
  next.setUTCDate(next.getUTCDate() + 1);
  return isSameDay(next, now);
}

// Atualiza XP e streak — gamificação adulta, nunca punitiva (secção 9 do master
// prompt): uma pausa reseta o streak sem penalização extra, "welcome back" silencioso.
//
// Tudo corre dentro de uma transação com `SELECT ... FOR UPDATE`: isto bloqueia
// a linha do utilizador até ao commit, eliminando a corrida ler-modificar-escrever
// que existia antes (duas respostas quase simultâneas liam o mesmo currentStreak
// e uma delas "vencia", perdendo o incremento da outra — no pior caso, apagava
// um streak de semanas). A lógica de datas mantém-se exatamente igual à anterior,
// só passou a correr sob bloqueio. Ver docs/decisions.md, auditoria 2026-08-26.
export async function recordActivity(userId: string, kind: ActivityKind) {
  const nextStreak = await prisma.$transaction(async (tx) => {
    const rows = await tx.$queryRaw<
      { currentStreak: number; longestStreak: number; lastActivityAt: Date | null }[]
    >`SELECT "currentStreak", "longestStreak", "lastActivityAt" FROM "LearningProfile" WHERE "userId" = ${userId} FOR UPDATE`;
    const profile = rows[0];
    if (!profile) return null;

    const now = new Date();
    let streak = profile.currentStreak;

    if (!profile.lastActivityAt) {
      streak = 1;
    } else if (isSameDay(profile.lastActivityAt, now)) {
      streak = profile.currentStreak || 1;
    } else if (isNextDay(profile.lastActivityAt, now)) {
      streak = profile.currentStreak + 1;
    } else {
      streak = 1;
    }

    await tx.learningProfile.update({
      where: { userId },
      data: {
        xp: { increment: XP[kind] },
        currentStreak: streak,
        longestStreak: Math.max(profile.longestStreak, streak),
        lastActivityAt: now,
      },
    });

    return streak;
  });

  if (nextStreak === null) return;
  const streakCode = STREAK_ACHIEVEMENTS[nextStreak];
  if (streakCode) await awardAchievement(userId, streakCode);
}
