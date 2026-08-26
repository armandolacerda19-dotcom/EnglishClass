import { requireUserWithProfile } from "@/lib/session";
import { getDailyChallenge, pickPracticeSentences } from "@/lib/dailyChallenge";
import { DailyChallengeRunner } from "@/components/challenge/DailyChallengeRunner";
import { Card } from "@/components/ui/Card";

export default async function DailyChallengePage() {
  await requireUserWithProfile();
  const words = await getDailyChallenge();
  const practiceSentences = pickPracticeSentences(words);

  if (words.length === 0) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Desafio Diário</h1>
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Ainda não há vocabulário suficiente para gerar o desafio de hoje. Complete uma lição em Learn primeiro.
          </p>
        </Card>
      </main>
    );
  }

  return <DailyChallengeRunner words={words} practiceSentences={practiceSentences} />;
}
