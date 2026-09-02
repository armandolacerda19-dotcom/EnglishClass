import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { getNextLessonForUser } from "@/lib/lessons";

// 2ª auditoria pós-redesign (achado P1, "sistema de comando pouco claro"):
// era uma lista plana de ~63 lições, todas com o mesmo Card, sem nenhuma
// indicação de "já fiz esta" ou "é aqui que fico". A Home já sabe qual é a
// próxima lição (`getNextLessonForUser`, mesma fonte de verdade: evento
// "lesson_completed" em AnalyticsEvent) — só nunca era mostrado aqui. Marca
// agora as lições concluídas (✓, esbatidas) e destaca a próxima com borda +
// rótulo "Continuar aqui", para o utilizador nunca ter de adivinhar por onde
// ia quando visita /learn diretamente (em vez de vir pela Home).
export default async function LearnPage() {
  const { user } = await requireUserWithProfile();

  const [sublevels, completions, nextLesson] = await Promise.all([
    prisma.sublevel.findMany({
      orderBy: { order: "asc" },
      include: {
        level: true,
        modules: {
          orderBy: { order: "asc" },
          include: { units: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
        },
      },
    }),
    prisma.analyticsEvent.findMany({
      where: { userId: user.id, eventName: "lesson_completed" },
      select: { propsJson: true },
    }),
    getNextLessonForUser(user.id),
  ]);

  const completedLessonIds = new Set(
    completions.map((c) => (c.propsJson as { lessonId?: string } | null)?.lessonId).filter((id): id is string => !!id)
  );

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-6 font-display text-2xl">Currículo</h1>

      {sublevels.map((sub) => (
        <section key={sub.id} className="mb-8">
          <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-verdigris">{sub.code}</h2>
          {sub.modules.length === 0 && (
            <p className="text-sm text-inkNeutral/60 dark:text-linen/60">Conteúdo em preparação.</p>
          )}
          {sub.modules.map((mod) => (
            <div key={mod.id} className="mb-3">
              <p className="mb-2 text-sm font-semibold">{mod.title}</p>
              {mod.units.map((unit) => (
                <div key={unit.id} className="mb-2 flex flex-col gap-2">
                  {unit.lessons.map((lesson) => {
                    const done = completedLessonIds.has(lesson.id);
                    const isNext = lesson.id === nextLesson?.id;
                    return (
                      <Link key={lesson.id} href={`/learn/lesson/${lesson.id}`}>
                        <Card
                          className={
                            isNext
                              ? "border-2 border-verdigris"
                              : done
                                ? "opacity-60 hover:border-verdigris"
                                : "hover:border-verdigris"
                          }
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm">{lesson.title}</p>
                            {isNext && (
                              <span className="shrink-0 rounded-control bg-verdigris px-2 py-0.5 font-mono text-xs text-white">
                                Continuar aqui
                              </span>
                            )}
                            {done && !isNext && <span className="shrink-0 text-verdigris">✓</span>}
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
