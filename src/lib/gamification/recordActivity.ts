import { prisma } from "@/lib/prisma";

const XP = {
  EXERCISE_CORRECT: 10,
  EXERCISE_INCORRECT: 2,
  WRITING: 15,
  SPEAKING: 15,
  TRANSLATION: 10,
  LESSON_COMPLETE: 30,
  DAILY_CHALLENGE: 20,
  MICRO_CHALLENGE: 8,
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
export async function recordActivity(userId: string, kind: ActivityKind) {
  const profile = await prisma.learningProfile.findUnique({ where: { userId } });
  if (!profile) return;

  const now = new Date();
  let nextStreak = profile.currentStreak;

  if (!profile.lastActivityAt) {
    nextStreak = 1;
  } else if (isSameDay(profile.lastActivityAt, now)) {
    nextStreak = profile.currentStreak || 1;
  } else if (isNextDay(profile.lastActivityAt, now)) {
    nextStreak = profile.currentStreak + 1;
  } else {
    nextStreak = 1;
  }

  await prisma.learningProfile.update({
    where: { userId },
    data: {
      xp: { increment: XP[kind] },
      currentStreak: nextStreak,
      longestStreak: Math.max(profile.longestStreak, nextStreak),
      lastActivityAt: now,
    },
  });
}
