"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StampBadge } from "@/components/ui/StampBadge";
import { PlayTranscript } from "@/components/ui/PlayTranscript";
import { TextField } from "@/components/ui/TextField";
import { submitDictation } from "@/app/(app)/practice/dictation/actions";
import { checkDictation } from "@/lib/dictation";
import type { DictationItem } from "@/content/dictation";

export function DictationRunner({ items }: { items: DictationItem[] }) {
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [checked, setChecked] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <h1 className="mb-4 font-display text-2xl">Ditado</h1>
        <Card>
          <p className="text-sm text-inkNeutral/70 dark:text-linen/70">
            Não há frases de ditado disponíveis de momento.
          </p>
        </Card>
      </main>
    );
  }

  const item = items[index]!;
  const isLast = index === items.length - 1;
  const result = checked ? checkDictation(answer, item.text) : null;

  function check() {
    if (!answer.trim()) return;
    const res = checkDictation(answer, item.text);
    setChecked(true);
    if (res.isCorrect) setCorrectCount((c) => c + 1);
  }

  async function advance() {
    if (isLast) {
      setSubmitting(true);
      await submitDictation(correctCount, items.length);
      setSubmitting(false);
      setDone(true);
    } else {
      setIndex((i) => i + 1);
      setAnswer("");
      setChecked(false);
    }
  }

  if (done) {
    return (
      <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <StampBadge code={`${correctCount}/${items.length}`} tone="verdigris" />
          <h1 className="font-display text-2xl">Ditado concluído!</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/home">
            <Button>Voltar à Home</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-lg lg:max-w-2xl px-6 py-10">
      <p className="mb-1 font-mono text-xs uppercase tracking-widest text-verdigris">
        Ditado · {item.level} · {index + 1} de {items.length}
      </p>
      <div className="mb-6 h-1 w-full rounded-full bg-ink/10 dark:bg-linen/10">
        <div
          className="h-1 rounded-full bg-verdigris transition-[width]"
          style={{ width: `${((index + 1) / items.length) * 100}%` }}
        />
      </div>

      <Card className="mb-4">
        <p className="mb-3 text-sm text-inkNeutral/70 dark:text-linen/70">
          Ouça a frase e escreva exatamente o que ouviu.
        </p>
        <PlayTranscript text={item.text} />

        <div className="mt-4">
          <TextField
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={checked}
            placeholder="Escreva aqui o que ouviu..."
          />
        </div>

        {result && (
          <div role="status" aria-live="polite" className="mt-3">
            <p className={`text-sm ${result.isCorrect ? "text-verdigris" : "text-clay"}`}>
              {result.isCorrect ? "Correto!" : "Quase — compare com a frase certa:"}
            </p>
            {!result.isCorrect && (
              <p className="mt-2 text-sm leading-relaxed">
                {result.diff.map((w, i) => (
                  <span key={i} className={w.correct ? "text-verdigris" : "font-semibold text-clay underline"}>
                    {w.word}{" "}
                  </span>
                ))}
              </p>
            )}
            <p className="mt-2 text-xs italic text-inkNeutral/60 dark:text-linen/60">{item.translationPt}</p>
          </div>
        )}
      </Card>

      <div className="flex justify-end">
        {!checked ? (
          <Button onClick={check} disabled={!answer.trim()}>
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
