import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { MICRO_CHALLENGES } from "@/lib/microChallenges";
import { Card } from "@/components/ui/Card";

export default async function MicroChallengesPage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Micro-Desafios</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Momentos curtos ao longo do dia — não substituem a lição nem o Desafio Diário, mas ajudam a manter o inglês
        presente entre eles.
      </p>

      <div className="flex flex-col gap-3">
        {MICRO_CHALLENGES.map((c) => (
          <Link key={c.id} href={`/practice/micro-challenges/${c.id}`}>
            <Card className="hover:border-verdigris">
              <p className="mb-1 font-display text-lg">{c.title}</p>
              <p className="text-sm text-inkNeutral/70 dark:text-linen/70">{c.subtitle}</p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
