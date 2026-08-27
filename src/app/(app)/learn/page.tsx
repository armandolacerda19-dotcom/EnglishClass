import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";

export default async function LearnPage() {
  await requireUserWithProfile();

  const sublevels = await prisma.sublevel.findMany({
    orderBy: { order: "asc" },
    include: {
      level: true,
      modules: {
        orderBy: { order: "asc" },
        include: { units: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
      },
    },
  });

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
                  {unit.lessons.map((lesson) => (
                    <Link key={lesson.id} href={`/learn/lesson/${lesson.id}`}>
                      <Card className="hover:border-verdigris">
                        <p className="text-sm">{lesson.title}</p>
                      </Card>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </section>
      ))}
    </main>
  );
}
