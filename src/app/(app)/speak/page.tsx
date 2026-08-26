import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { Card } from "@/components/ui/Card";

export default async function SpeakHubPage() {
  await requireUserWithProfile();

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <h1 className="mb-6 font-display text-2xl">Speak</h1>
      <Link href="/speak/tutor">
        <Card className="hover:border-verdigris">
          <p className="mb-1 font-display text-lg">AI Tutor</p>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Converse com The Coach — feedback com memória dos seus erros recorrentes.
          </p>
        </Card>
      </Link>
    </main>
  );
}
