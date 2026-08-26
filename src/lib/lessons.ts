import { prisma } from "@/lib/prisma";

// Aponta para a primeira lição ainda não tentada pelo utilizador, seguindo a ordem
// do currículo (Lesson.order). "Tentada" = tem pelo menos uma ExerciseAttempt num
// exercício dessa lição — proxy simples para MVP1 (sem tabela dedicada de conclusão).
export async function getNextLessonForUser(userId: string) {
  const [lessons, attempts] = await Promise.all([
    prisma.lesson.findMany({ orderBy: { order: "asc" } }),
    prisma.exerciseAttempt.findMany({
      where: { userId, exercise: { lessonId: { not: null } } },
      select: { exercise: { select: { lessonId: true } } },
    }),
  ]);

  const touchedLessonIds = new Set(attempts.map((a) => a.exercise.lessonId).filter((id): id is string => !!id));
  const next = lessons.find((lesson) => !touchedLessonIds.has(lesson.id));

  return next ?? lessons.at(-1) ?? null;
}
