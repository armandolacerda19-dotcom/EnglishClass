import { notFound } from "next/navigation";
import { requireUserWithProfile } from "@/lib/session";
import { buildQuestionSet } from "@/lib/practiceQuestions";
import { TopicPracticeRunner } from "@/components/challenge/TopicPracticeRunner";
import { Card } from "@/components/ui/Card";
import type { Pillar } from "@prisma/client";

const VALID_PILLARS: Pillar[] = ["GRAMMAR", "VOCABULARY", "LISTENING", "READING", "TRANSLATION"];
const QUESTIONS_PER_SESSION = 8;

export default async function TopicPracticePage({ params }: { params: { pillar: string } }) {
  const { user } = await requireUserWithProfile();

  const pillar = params.pillar.toUpperCase() as Pillar;
  if (!VALID_PILLARS.includes(pillar)) notFound();

  // Seed variável a cada visita (não é um diagnóstico gated) — perguntas novas
  // de cada vez que o utilizador escolhe este tema, dentro do que existe seedado.
  const seed = Date.now() ^ pillar.length;
  const questions = await buildQuestionSet([pillar], seed, QUESTIONS_PER_SESSION, user.id);

  if (questions.length === 0) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Sem exercícios ainda</h1>
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Ainda não há exercícios seedados para este tema. Complete algumas lições em Learn primeiro.
          </p>
        </Card>
      </main>
    );
  }

  return <TopicPracticeRunner pillar={pillar} questions={questions} />;
}
