import Link from "next/link";
import { requireUserWithProfile } from "@/lib/session";
import { listGrammarTopics } from "@/lib/grammarQuiz";
import { Card } from "@/components/ui/Card";

// Quiz de Gramática por Tema — tipo de exercício novo (Exercise Engine,
// 2026-08-28). Formaliza Challenge (exercícios reais sem andaimes) + Apply
// (usar a estrutura em contexto, avaliado pela IA) para cada GrammarConcept
// já seedado — Learn/Practice já existem dentro da lição.
export default async function GrammarQuizPage() {
  await requireUserWithProfile();
  const topics = await listGrammarTopics();

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <h1 className="mb-2 font-display text-2xl">Quiz de Gramática por Tema</h1>
      <p className="mb-6 text-sm text-inkNeutral/70 dark:text-linen/70">
        Escolha um tema já estudado. Challenge testa sem ajudas; Apply pede para usar a estrutura numa frase sua.
      </p>

      <div className="flex flex-col gap-2">
        {topics.map((t) => (
          <Link key={t.id} href={`/practice/grammar-quiz/${t.id}`}>
            <Card className="hover:border-verdigris">
              <p className="text-sm font-semibold">{t.title}</p>
              <p className="text-xs text-inkNeutral/60 dark:text-linen/60">{t.exerciseCount} exercícios</p>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
