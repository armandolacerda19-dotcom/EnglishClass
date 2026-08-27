import { prisma } from "@/lib/prisma";

// Aponta para a primeira lição ainda não CONCLUÍDA pelo utilizador, seguindo a
// ordem do currículo (Lesson.order).
//
// Antes disto, "feita" queria dizer "tem pelo menos uma ExerciseAttempt" — ou
// seja, responder a UM exercício qualquer da lição marcava-a inteira como
// concluída. Um utilizador que abandonasse uma lição a meio via "Continuar"
// empurrá-lo para a lição seguinte para sempre, sem forma de voltar à que
// tinha ficado incompleta. Ver docs/decisions.md, auditoria 2026-08-26.
//
// A fonte de verdade agora é o evento "lesson_completed" (AnalyticsEvent),
// escrito por completeLesson() em learn/actions.ts só quando o utilizador
// chega mesmo ao fim da lição (ver LessonComplete em LessonRunner.tsx). Não
// precisa de alteração de schema — essa escrita já existia, só nunca era lida.
export async function getNextLessonForUser(userId: string) {
  const [lessons, completions] = await Promise.all([
    prisma.lesson.findMany({ orderBy: { order: "asc" } }),
    prisma.analyticsEvent.findMany({
      where: { userId, eventName: "lesson_completed" },
      select: { propsJson: true },
    }),
  ]);

  const completedLessonIds = new Set(
    completions
      .map((c) => (c.propsJson as { lessonId?: string } | null)?.lessonId)
      .filter((id): id is string => !!id)
  );
  const next = lessons.find((lesson) => !completedLessonIds.has(lesson.id));

  return next ?? lessons.at(-1) ?? null;
}
