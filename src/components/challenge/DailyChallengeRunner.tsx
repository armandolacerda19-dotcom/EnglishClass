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
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [alreadyDoneToday, setAlreadyDoneToday] = useState<boolean | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const word = words[index]!;
  const isLast = index === words.length - 1;
  const isCorrect = selected === word.translationPt;

  function check() {
    if (!selected) return;
    setChecked(true);
    setScore((s) => (isCorrect ? s + 1 : s));
    // Fire-and-forget: uma falha aqui só significa que esta palavra não entra
    // na fila de revisão espaçada desta vez — não deve travar a sessão.
    void recordVocabExposure(word.id, selected);
  }

  async function advance() {
    const nextScore = score;
    if (isLast) {
      setSubmitting(true);
      setSubmitError(null);
      try {
        const result = await completeDailyChallenge(nextScore, words.length);
        setAlreadyDoneToday(result.alreadyDoneToday);
        setDone(true);
      } catch {
        setSubmitError("Não foi possível guardar o resultado — verifique a ligação e tente novamente.");
      } finally {
        setSubmitting(false);
      }
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
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
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-brass">
        Desafio Diário · {index + 1} de {words.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-brass transition-[width]"
          style={{ width: `${((index + 1) / words.length) * 100}%` }}
        />
      </div>

      <Card className="border-brass/30">
        <p className="mb-1 font-mono text-xs uppercase tracking-wide text-brass">O que significa...</p>
        <p className="mb-4 font-display text-2xl">{word.headword}</p>

        <fieldset className="flex flex-col gap-2">
          {word.options.map((opt) => (
            <label key={opt} className="flex items-center gap-2 rounded-control border border-ink/10 p-3 text-sm">
              <input
                type="radio"
                name={word.id}
                checked={selected === opt}
                onChange={() => setSelected(opt)}
                disabled={checked}
              />
              {opt}
            </label>
          ))}
        </fieldset>

        {checked && (
          <p role="status" aria-live="polite" className={`mt-3 text-sm ${isCorrect ? "text-verdigris" : "text-clay"}`}>
            {isCorrect ? "Correto." : `Incorreto. Era: ${word.translationPt}`}
          </p>
        )}
      </Card>

      {submitError && (
        <p role="alert" className="mt-3 text-sm text-clay">
          {submitError}
        </p>
      )}

      <div className="mt-4 flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={!selected}>
            Verificar
          </Button>
        ) : (
          <Button onClick={advance} disabled={submitting}>
            {isLast ? "Terminar" : "Seguinte"}
          </Button>
        )}
      </div>
    </main>
  );
}
