"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { completeDailyChallenge, recordVocabExposure } from "@/app/(app)/practice/daily-challenge/actions";
import type { DailyChallengeWord } from "@/lib/dailyChallenge";

interface DailyChallengeRunnerProps {
  words: DailyChallengeWord[];
  practiceSentences: { sentence: string; headword: string }[];
}

export function DailyChallengeRunner({ words, practiceSentences }: DailyChallengeRunnerProps) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [alreadyDoneToday, setAlreadyDoneToday] = useState<boolean | null>(null);

  const word = words[index]!;
  const isLast = index === words.length - 1;

  async function confirm() {
    if (!selected) return;
    const isCorrect = selected === word.translationPt;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);
    void recordVocabExposure(word.id, isCorrect);

    if (isLast) {
      const result = await completeDailyChallenge(nextScore, words.length);
      setAlreadyDoneToday(result.alreadyDoneToday);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${score}/${words.length}`} tone="brass" />
          <h1 className="font-display text-2xl">Desafio de hoje concluído!</h1>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            {alreadyDoneToday
              ? "Já tinha feito o desafio de hoje — este resultado não conta XP extra, mas continue a praticar."
              : "Acertou " + score + " de " + words.length + " palavras."}
          </p>
        </div>

        {practiceSentences.length > 0 && (
          <Card className="mb-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-verdigris">Frases para praticar</p>
            <ul className="flex flex-col gap-3">
              {practiceSentences.map((p, i) => (
                <li key={i}>
                  <p className="text-sm italic">"{p.sentence}"</p>
                  <p className="text-xs text-inkNeutral/60 dark:text-linen/60">usa: {p.headword}</p>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {words.some((w) => w.collocations.length > 0) && (
          <Card className="mb-4">
            <p className="mb-3 font-mono text-xs uppercase tracking-wide text-brass">Também pode dizer</p>
            <ul className="flex flex-col gap-2">
              {words
                .filter((w) => w.collocations.length > 0)
                .map((w) => (
                  <li key={w.id} className="text-sm">
                    <span className="font-semibold">{w.headword}</span>
                    <span className="text-inkNeutral/60 dark:text-linen/60"> → {w.collocations.join(", ")}</span>
                  </li>
                ))}
            </ul>
          </Card>
        )}

        <Link href="/home">
          <Button>Voltar à Home</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">
        Desafio Diário · {index + 1} de {words.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${((index + 1) / words.length) * 100}%` }}
        />
      </div>

      <Card>
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-verdigris">O que significa...</p>
        <p className="mb-4 font-display text-2xl">{word.headword}</p>

        <fieldset className="flex flex-col gap-2">
          {word.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input type="radio" name={word.id} checked={selected === opt} onChange={() => setSelected(opt)} />
              {opt}
            </label>
          ))}
        </fieldset>
      </Card>

      <div className="mt-4 flex justify-end">
        <Button onClick={confirm} disabled={!selected}>
          {isLast ? "Terminar" : "Seguinte"}
        </Button>
      </div>
    </main>
  );
}
